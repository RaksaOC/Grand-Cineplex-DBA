create type payment_type as enum ('cash', 'card', 'digital_wallet', 'bank_transfer');

alter type payment_type owner to postgres;

create type booking_status as enum ('pending', 'reserved', 'confirmed', 'cancelled', 'refunded');

alter type booking_status owner to postgres;

create type payment_status as enum ('pending', 'completed', 'failed', 'refunded');

alter type payment_status owner to postgres;

create type staff_role as enum ('cashier', 'admin', 'manager');

alter type staff_role owner to postgres;

create type seat_type as enum ('regular', 'premium', 'vip');

alter type seat_type owner to postgres;

create table if not exists cinemas
(
    id         serial
        primary key,
    name       varchar(255) not null,
    address    text,
    city       varchar(100),
    state      varchar(100),
    country    varchar(100),
    phone      varchar(20),
    email      varchar(100),
    is_active  boolean   default true,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
)
    using ???;

alter table cinemas
    owner to postgres;

create index if not exists idx_cinemas_location
    on cinemas using ??? (city, state, country);

create table if not exists movies
(
    id           serial
        primary key,
    title        varchar(200) not null,
    description  text,
    duration     integer      not null,
    genre        varchar(100),
    rating       varchar(10),
    poster_url   text,
    release_date date,
    created_at   timestamp default CURRENT_TIMESTAMP,
    updated_at   timestamp default CURRENT_TIMESTAMP
)
    using ???;

alter table movies
    owner to postgres;

create table if not exists theaters
(
    id         serial
        primary key,
    name       varchar(100) not null,
    cinema_id  integer      not null
        references cinemas,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
)
    using ???;

alter table theaters
    owner to postgres;

create index if not exists idx_theaters_cinema
    on theaters using ??? (cinema_id);

create table if not exists seats
(
    id          serial
        primary key,
    theater_id  integer    not null
        references theaters,
    row_number  varchar(5) not null,
    seat_number integer    not null,
    seat_type   seat_type default 'regular'::seat_type,
    created_at  timestamp default CURRENT_TIMESTAMP,
    updated_at  timestamp default CURRENT_TIMESTAMP,
)
    using ???;

alter table seats
    owner to postgres;

create table if not exists screenings
(
    id             serial
        primary key,
    movie_id       integer       not null
        references movies,
    theater_id     integer       not null
        references theaters,
    screening_date date          not null,
    screening_time time          not null,
    price          numeric(8, 2) not null,
    created_at     timestamp default CURRENT_TIMESTAMP,
    updated_at     timestamp default CURRENT_TIMESTAMP,
)
    using ???;

alter table screenings
    owner to postgres;

create index if not exists idx_screenings_movie_date
    on screenings using ??? (movie_id, screening_date);

create index if not exists idx_screenings_theater_date
    on screenings using ??? (theater_id, screening_date);

create table if not exists customers
(
    id            serial
        primary key,
    name          varchar(100) not null,
    email         varchar(100) not null
        unique,
    phone         varchar(20),
    password      varchar(255) not null,
    date_of_birth date,
    created_at    timestamp default CURRENT_TIMESTAMP,
    updated_at    timestamp default CURRENT_TIMESTAMP
)
    using ???;

alter table customers
    owner to postgres;

create index if not exists idx_customers_email
    on customers using ??? (email);

create index if not exists idx_customers_phone
    on customers using ??? (phone);

create table if not exists staff
(
    id         serial
        primary key,
    name       varchar(100) not null,
    email      varchar(100) not null
        unique,
    password   varchar(255) not null,
    role       staff_role   not null,
    phone      varchar(20),
    hired_date date,
    is_active  boolean   default true,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
)
    using ???;

alter table staff
    owner to postgres;

create table if not exists bookings
(
    id                  serial
        primary key,
    customer_id         integer
        references customers,
    screening_id        integer not null
        references screenings,
    status              booking_status default 'pending'::booking_status,
    created_by_staff_id integer
        references staff,
    created_at          timestamp      default CURRENT_TIMESTAMP,
    updated_at          timestamp      default CURRENT_TIMESTAMP
)
    using ???;

alter table bookings
    owner to postgres;

create index if not exists idx_bookings_customer
    on bookings using ??? (customer_id);

create index if not exists idx_bookings_screening
    on bookings using ??? (screening_id);

create index if not exists idx_bookings_date
    on bookings using ??? (created_at);

create table if not exists tickets
(
    id         serial
        primary key,
    booking_id integer not null
        references bookings
            on delete cascade,
    seat_id    integer not null
        references seats,
    created_at timestamp default CURRENT_TIMESTAMP,
)
    using ???;

alter table tickets
    owner to postgres;

create index if not exists idx_tickets_booking
    on tickets using ??? (booking_id);

create index if not exists idx_tickets_seat
    on tickets using ??? (seat_id);

create table if not exists payments
(
    id         serial
        primary key,
    booking_id integer        not null
        references bookings,
    amount     numeric(10, 2) not null,
    method     payment_type   not null,
    status     payment_status default 'pending'::payment_status,
    created_at timestamp      default CURRENT_TIMESTAMP,
    updated_at timestamp      default CURRENT_TIMESTAMP
)
    using ???;

alter table payments
    owner to postgres;

create index if not exists idx_payments_booking
    on payments using ??? (booking_id);

create index if not exists idx_payments_status
    on payments using ??? (status);

create or replace function create_created_at_column() returns trigger
    language plpgsql
as
$$
BEGIN
    NEW.created_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

alter function create_created_at_column() owner to postgres;

create trigger trigger_create_movies_created_at
    before insert
    on movies
    for each row
execute procedure create_created_at_column();

create trigger trigger_create_theaters_created_at
    before insert
    on theaters
    for each row
execute procedure create_created_at_column();

create trigger trigger_create_screenings_created_at
    before insert
    on screenings
    for each row
execute procedure create_created_at_column();

create trigger trigger_create_customers_created_at
    before insert
    on customers
    for each row
execute procedure create_created_at_column();

create trigger trigger_create_staff_created_at
    before insert
    on staff
    for each row
execute procedure create_created_at_column();

create trigger trigger_create_bookings_created_at
    before insert
    on bookings
    for each row
execute procedure create_created_at_column();

create trigger trigger_create_tickets_created_at
    before insert
    on tickets
    for each row
execute procedure create_created_at_column();

create trigger trigger_create_payments_created_at
    before insert
    on payments
    for each row
execute procedure create_created_at_column();

create or replace function update_updated_at_column() returns trigger
    language plpgsql
as
$$
BEGIN
    NEW.updated_at
= CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$;

alter function update_updated_at_column() owner to postgres;

create trigger trigger_update_movies_updated_at
    before update
    on movies
    for each row
execute procedure update_updated_at_column();

create trigger trigger_update_theaters_updated_at
    before update
    on theaters
    for each row
execute procedure update_updated_at_column();

create trigger trigger_update_screenings_updated_at
    before update
    on screenings
    for each row
execute procedure update_updated_at_column();

create trigger trigger_update_customers_updated_at
    before update
    on customers
    for each row
execute procedure update_updated_at_column();

create trigger trigger_update_staff_updated_at
    before update
    on staff
    for each row
execute procedure update_updated_at_column();

create trigger trigger_update_bookings_updated_at
    before update
    on bookings
    for each row
execute procedure update_updated_at_column();

create trigger trigger_update_tickets_updated_at
    before update
    on tickets
    for each row
execute procedure update_updated_at_column();

create trigger trigger_update_payments_updated_at
    before update
    on payments
    for each row
execute procedure update_updated_at_column();

