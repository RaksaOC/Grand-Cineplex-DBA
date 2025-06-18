-- ========================================
-- IMPROVED CINEMA MANAGEMENT SYSTEM DDL
-- ========================================

-- Custom ENUM types
CREATE TYPE payment_type AS ENUM ('cash', 'card', 'digital_wallet', 'bank_transfer');
CREATE TYPE booking_status AS ENUM ('pending', 'reserved', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE staff_role AS ENUM ('cashier', 'admin', 'manager');
CREATE TYPE seat_type AS ENUM ('regular', 'premium', 'vip');

-- ========================================
-- CORE TABLES
-- ========================================

CREATE TABLE cinemas
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    address    TEXT,
    city       VARCHAR(100),
    state      VARCHAR(100),
    country    VARCHAR(100),
    phone      VARCHAR(20),
    email      VARCHAR(100),
    is_active  BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE movies
(
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    duration     INTEGER      NOT NULL, -- in minutes (fixed from TIME type)
    genre        VARCHAR(100),
    rating       VARCHAR(10),
    poster_url   TEXT,                  -- renamed from poster for clarity
    release_date DATE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Theaters/Screens table
CREATE TABLE theaters
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    cinema_id  INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id)
);

-- Seats table (removed is_booked - seats are reusable per show)
CREATE TABLE seats
(
    id          SERIAL PRIMARY KEY,
    theater_id  INTEGER    NOT NULL,
    row_number  VARCHAR(5) NOT NULL,
    seat_number INTEGER    NOT NULL,
    seat_type   seat_type DEFAULT 'regular',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theater_id) REFERENCES theaters (id),
    UNIQUE (theater_id, row_number, seat_number)
);

-- Screenings table
CREATE TABLE screenings
(
    id             SERIAL PRIMARY KEY,
    movie_id       INTEGER       NOT NULL,
    theater_id     INTEGER       NOT NULL,
    screening_date DATE          NOT NULL,
    screening_time TIME          NOT NULL,
    price          DECIMAL(8, 2) NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (theater_id) REFERENCES theaters (id),
    UNIQUE (theater_id, screening_date, screening_time)
);

-- ========================================
-- USER MANAGEMENT
-- ========================================

-- Customers table
CREATE TABLE customers
(
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)        NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    phone         VARCHAR(20),
    password      VARCHAR(255)        NOT NULL,
    date_of_birth DATE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff table for cashier or admin support
CREATE TABLE staff
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    role       staff_role          NOT NULL,
    phone      VARCHAR(20),
    hired_date DATE,
    is_active  BOOLEAN   DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- BOOKING SYSTEM (IMPROVED STRUCTURE)
-- ========================================

-- Bookings table (parent table - removed individual ticket fields)
CREATE TABLE bookings
(
    id                  SERIAL PRIMARY KEY,
    customer_id         INTEGER,
    screening_id        INTEGER NOT NULL,
    status              booking_status DEFAULT 'pending',
    created_by_staff_id INTEGER, -- for in-person sales but can also be used to know if it is booked by customer or cashier (walk-in) can be null
    created_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id),
    FOREIGN KEY (screening_id) REFERENCES screenings (id),
    FOREIGN KEY (created_by_staff_id) REFERENCES staff (id)
);

-- Tickets table (child table - multiple tickets per booking)
CREATE TABLE tickets
(
    id         SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    seat_id    INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats (id),
    UNIQUE (booking_id, seat_id)
);

-- ========================================
-- PAYMENT SYSTEM
-- ========================================

-- Payments table (linked to bookings)
CREATE TABLE payments
(
    id         SERIAL PRIMARY KEY,
    booking_id INTEGER        NOT NULL,
    amount     DECIMAL(10, 2) NOT NULL,
    method     payment_type   NOT NULL,
    status     payment_status DEFAULT 'pending',
    created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings (id)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Customers
CREATE INDEX idx_customers_email ON customers (email);
CREATE INDEX idx_customers_phone ON customers (phone);

-- Screenings
CREATE INDEX idx_screenings_movie_date ON screenings (movie_id, screening_date);
CREATE INDEX idx_screenings_theater_date ON screenings (theater_id, screening_date);

-- Bookings
CREATE INDEX idx_bookings_customer ON bookings (customer_id);
CREATE INDEX idx_bookings_screening ON bookings (screening_id);
CREATE INDEX idx_bookings_date ON bookings (created_at);

-- Tickets
CREATE INDEX idx_tickets_booking ON tickets (booking_id);
CREATE INDEX idx_tickets_seat ON tickets (seat_id);

-- Payments
CREATE INDEX idx_payments_booking ON payments (booking_id);
CREATE INDEX idx_payments_status ON payments (status);

-- Theaters
CREATE INDEX idx_theaters_cinema ON theaters(cinema_id);
CREATE INDEX idx_cinemas_location ON cinemas(city, state, country);

-- ========================================
-- CONSTRAINTS AND TRIGGERS
-- ========================================

CREATE FUNCTION create_created_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.created_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

-- Function to update timestamps
CREATE
    OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at
        = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

-- Triggers for created_at columns
CREATE TRIGGER trigger_create_movies_created_at
    BEFORE INSERT
    ON movies
    FOR EACH ROW
EXECUTE FUNCTION create_created_at_column();

CREATE TRIGGER trigger_create_theaters_created_at
    BEFORE INSERT
    ON theaters
    FOR EACH ROW
EXECUTE FUNCTION create_created_at_column();

CREATE TRIGGER trigger_create_screenings_created_at
    BEFORE INSERT
    ON screenings
    FOR EACH ROW
EXECUTE FUNCTION create_created_at_column();

CREATE TRIGGER trigger_create_customers_created_at
    BEFORE INSERT
    ON customers
    FOR EACH ROW
EXECUTE FUNCTION create_created_at_column();

CREATE TRIGGER trigger_create_staff_created_at
    BEFORE INSERT
    ON staff
    FOR EACH ROW
EXECUTE FUNCTION create_created_at_column();

CREATE TRIGGER trigger_create_bookings_created_at
    BEFORE INSERT
    ON bookings
    FOR EACH ROW
EXECUTE FUNCTION create_created_at_column();

CREATE TRIGGER trigger_create_tickets_created_at
    BEFORE INSERT
    ON tickets
    FOR EACH ROW
EXECUTE FUNCTION create_created_at_column();

CREATE TRIGGER trigger_create_payments_created_at
    BEFORE INSERT
    ON payments
    FOR EACH ROW
EXECUTE FUNCTION create_created_at_column();

-- Triggers for updated_at columns
CREATE TRIGGER trigger_update_movies_updated_at
    BEFORE UPDATE
    ON movies
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_theaters_updated_at
    BEFORE UPDATE
    ON theaters
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_screenings_updated_at
    BEFORE UPDATE
    ON screenings
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_customers_updated_at
    BEFORE UPDATE
    ON customers
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_staff_updated_at
    BEFORE UPDATE
    ON staff
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_bookings_updated_at
    BEFORE UPDATE
    ON bookings
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_tickets_updated_at
    BEFORE UPDATE
    ON tickets
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_payments_updated_at
    BEFORE UPDATE
    ON payments
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();



-- ========================================
-- DROP TABLES (DANGEROUS)
-- ========================================
SET session_replication_role = 'replica';

DROP TABLE IF EXISTS cinema CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS screenings CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS theaters CASCADE;
DROP TABLE IF EXISTS movies CASCADE;

SET session_replication_role = 'origin';