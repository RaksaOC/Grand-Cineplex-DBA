import psycopg2
import time
import csv
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create results directory if it doesn't exist
RESULTS_DIR = os.path.join(os.path.dirname(__file__), 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)

# Database connection parameters from environment variables
DB_PARAMS = {
    "dbname": os.getenv("DB_NAME", "cinema"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "postgres"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432")
}

# Index definitions with their CREATE statements
index_definitions = {
    "idx_cinemas_location": "CREATE INDEX idx_cinemas_location ON cinemas (city, state, country);",
    "idx_theaters_cinema": "CREATE INDEX idx_theaters_cinema ON theaters (cinema_id);",
    "idx_screenings_movie_date": "CREATE INDEX idx_screenings_movie_date ON screenings (movie_id, screening_date);",
    "idx_screenings_theater_date": "CREATE INDEX idx_screenings_theater_date ON screenings (theater_id, screening_date);",
    "idx_customers_email": "CREATE INDEX idx_customers_email ON customers (email);",
    "idx_customers_phone": "CREATE INDEX idx_customers_phone ON customers (phone);",
    "idx_bookings_customer": "CREATE INDEX idx_bookings_customer ON bookings (customer_id);",
    "idx_bookings_screening": "CREATE INDEX idx_bookings_screening ON bookings (screening_id);",
    "idx_bookings_date": "CREATE INDEX idx_bookings_date ON bookings (created_at);",
    "idx_tickets_booking": "CREATE INDEX idx_tickets_booking ON tickets (booking_id);",
    "idx_tickets_seat": "CREATE INDEX idx_tickets_seat ON tickets (seat_id);",
    "idx_payments_booking": "CREATE INDEX idx_payments_booking ON payments (booking_id);",
    "idx_payments_status": "CREATE INDEX idx_payments_status ON payments (status);"
}

# Complex test queries for each index
test_queries = {
    "idx_cinemas_location": """
        SELECT c.*, COUNT(t.id) as total_theaters, COUNT(s.id) as total_screens
        FROM cinemas c
        LEFT JOIN theaters t ON c.id = t.cinema_id
        LEFT JOIN screenings s ON t.id = s.theater_id
        WHERE c.city = 'Phnom Penh' 
        AND c.state = 'Phnom Penh' 
        AND c.country = 'Cambodia'
        GROUP BY c.id;
    """,
    
    "idx_theaters_cinema": """
        SELECT t.*, c.name as cinema_name, 
        COUNT(DISTINCT s.movie_id) as unique_movies,
        COUNT(s.id) as total_screenings
        FROM theaters t
        JOIN cinemas c ON t.cinema_id = c.id
        LEFT JOIN screenings s ON t.id = s.theater_id
        WHERE t.cinema_id = 1
        GROUP BY t.id, c.name;
    """,
    
    "idx_screenings_movie_date": """
        SELECT s.*, m.title, t.name as theater_name,
        COUNT(b.id) as total_bookings,
        COUNT(DISTINCT b.customer_id) as unique_customers
        FROM screenings s
        JOIN movies m ON s.movie_id = m.id
        JOIN theaters t ON s.theater_id = t.id
        LEFT JOIN bookings b ON s.id = b.screening_id
        WHERE s.movie_id = 1 
        AND s.screening_date = CURRENT_DATE
        GROUP BY s.id, m.title, t.name;
    """,
    
    "idx_screenings_theater_date": """
        SELECT s.*, m.title, t.name as theater_name,
        c.name as cinema_name,
        COUNT(b.id) as total_bookings
        FROM screenings s
        JOIN theaters t ON s.theater_id = t.id
        JOIN movies m ON s.movie_id = m.id
        JOIN cinemas c ON t.cinema_id = c.id
        LEFT JOIN bookings b ON s.id = b.screening_id
        WHERE s.theater_id = 1 
        AND s.screening_date = CURRENT_DATE
        GROUP BY s.id, m.title, t.name, c.name;
    """,
    
    "idx_customers_email": """
        SELECT c.*, 
        COUNT(b.id) as total_bookings,
        SUM(p.amount) as total_spent,
        STRING_AGG(DISTINCT m.title, ', ') as watched_movies
        FROM customers c
        LEFT JOIN bookings b ON c.id = b.customer_id
        LEFT JOIN payments p ON b.id = p.booking_id
        LEFT JOIN screenings s ON b.screening_id = s.id
        LEFT JOIN movies m ON s.movie_id = m.id
        WHERE c.email = 'test@example.com'
        GROUP BY c.id;
    """,
    
    "idx_customers_phone": """
        SELECT c.*, 
        COUNT(b.id) as total_bookings,
        COUNT(DISTINCT s.movie_id) as unique_movies_watched,
        MAX(b.created_at) as last_booking_date
        FROM customers c
        LEFT JOIN bookings b ON c.id = b.customer_id
        LEFT JOIN screenings s ON b.screening_id = s.id
        WHERE c.phone = '+855123456789'
        GROUP BY c.id;
    """,
    
    "idx_bookings_customer": """
        SELECT b.*, c.name as customer_name,
        m.title as movie_title,
        t.name as theater_name,
        p.amount as payment_amount,
        COUNT(tk.id) as number_of_tickets
        FROM bookings b
        JOIN customers c ON b.customer_id = c.id
        JOIN screenings s ON b.screening_id = s.id
        JOIN movies m ON s.movie_id = m.id
        JOIN theaters t ON s.theater_id = t.id
        LEFT JOIN payments p ON b.id = p.booking_id
        LEFT JOIN tickets tk ON b.id = tk.booking_id
        WHERE b.customer_id = 1
        GROUP BY b.id, c.name, m.title, t.name, p.amount;
    """,
    
    "idx_bookings_screening": """
        SELECT b.*, s.screening_date, s.screening_time,
        m.title as movie_title,
        COUNT(t.id) as tickets_sold,
        SUM(p.amount) as total_revenue
        FROM bookings b
        JOIN screenings s ON b.screening_id = s.id
        JOIN movies m ON s.movie_id = m.id
        LEFT JOIN tickets t ON b.id = t.booking_id
        LEFT JOIN payments p ON b.id = p.booking_id
        WHERE b.screening_id = 1
        GROUP BY b.id, s.screening_date, s.screening_time, m.title;
    """,
    
    "idx_bookings_date": """
        SELECT DATE(b.created_at) as booking_date,
        COUNT(*) as total_bookings,
        COUNT(DISTINCT b.customer_id) as unique_customers,
        SUM(p.amount) as total_revenue,
        COUNT(DISTINCT s.movie_id) as unique_movies
        FROM bookings b
        LEFT JOIN payments p ON b.id = p.booking_id
        JOIN screenings s ON b.screening_id = s.id
        WHERE b.created_at >= CURRENT_DATE - INTERVAL '1 day'
        GROUP BY DATE(b.created_at);
    """,
    
    "idx_tickets_booking": """
        SELECT t.*, b.status as booking_status,
        s.row_number, s.seat_number,
        m.title as movie_title,
        th.name as theater_name
        FROM tickets t
        JOIN bookings b ON t.booking_id = b.id
        JOIN seats s ON t.seat_id = s.id
        JOIN screenings sc ON b.screening_id = sc.id
        JOIN movies m ON sc.movie_id = m.id
        JOIN theaters th ON sc.theater_id = th.id
        WHERE t.booking_id = 1;
    """,
    
    "idx_tickets_seat": """
        SELECT t.*, s.row_number, s.seat_number,
        th.name as theater_name,
        m.title as movie_title,
        sc.screening_date, sc.screening_time
        FROM tickets t
        JOIN seats s ON t.seat_id = s.id
        JOIN theaters th ON s.theater_id = th.id
        JOIN bookings b ON t.booking_id = b.id
        JOIN screenings sc ON b.screening_id = sc.id
        JOIN movies m ON sc.movie_id = m.id
        WHERE t.seat_id = 1;
    """,
    
    "idx_payments_booking": """
        SELECT p.*, b.status as booking_status,
        c.name as customer_name,
        m.title as movie_title,
        COUNT(t.id) as number_of_tickets
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        JOIN customers c ON b.customer_id = c.id
        JOIN screenings s ON b.screening_id = s.id
        JOIN movies m ON s.movie_id = m.id
        LEFT JOIN tickets t ON b.id = t.booking_id
        WHERE p.booking_id = 1
        GROUP BY p.id, b.status, c.name, m.title;
    """,
    
    "idx_payments_status": """
        SELECT p.status,
        COUNT(*) as total_payments,
        SUM(p.amount) as total_amount,
        COUNT(DISTINCT b.customer_id) as unique_customers,
        COUNT(DISTINCT b.screening_id) as unique_screenings
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        WHERE p.status = 'pending'
        GROUP BY p.status;
    """
}

def run_test(cursor, conn, query, runs=3):
    times = []
    for _ in range(runs):
        start = time.perf_counter()
        try:
            cursor.execute(query)
            cursor.fetchall()  # Ensure query completes
            conn.commit()  # Commit after each query
        except Exception as e:
            print(f"Query failed: {e}")
            conn.rollback()  # Rollback on error
            return None
        end = time.perf_counter()
        times.append((end - start) * 1000)  # Convert to milliseconds
    return times

def write_results(results, filename='results_complex.csv'):
    file_path = os.path.join(RESULTS_DIR, filename)
    file_exists = os.path.isfile(file_path)
    
    with open(file_path, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['index_name', 'query_type', 'run_1_ms', 'run_2_ms', 'run_3_ms', 'avg_ms', 'index_applied', 'query'])
        writer.writerows(results)

def main():
    results = []
    
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        
        for index_name, query in test_queries.items():
            print(f"\nTesting {index_name}...")
            
            # Drop index if exists
            try:
                cursor.execute(f"DROP INDEX IF EXISTS {index_name};")
                conn.commit()
            except Exception as e:
                print(f"Failed to drop index: {e}")
                conn.rollback()
                continue
            
            # Test without index
            times_without = run_test(cursor, conn, query)
            if times_without:
                avg_without = sum(times_without) / len(times_without)
                results.append([
                    index_name,
                    'complex',
                    *times_without,
                    avg_without,
                    False,
                    query
                ])
            
            # Create index using predefined statement
            create_index_sql = index_definitions[index_name]
            print(f"Creating index with: {create_index_sql}")
            try:
                cursor.execute(create_index_sql)
                conn.commit()
            except Exception as e:
                print(f"Failed to create index: {e}")
                conn.rollback()
                continue
            
            # Test with index
            times_with = run_test(cursor, conn, query)
            if times_with:
                avg_with = sum(times_with) / len(times_with)
                results.append([
                    index_name,
                    'complex',
                    *times_with,
                    avg_with,
                    True,
                    query
                ])
        
        write_results(results)
        print(f"\nResults have been written to {os.path.join(RESULTS_DIR, 'results_complex.csv')}")
        
    except Exception as e:
        print(f"Database connection failed: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main() 