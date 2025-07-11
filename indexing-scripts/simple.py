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

# Index definitions
index_definitions = {
    "idx_cinemas_location": {
        "table": "cinemas",
        "columns": "(city, state, country)",
        "query": "SELECT * FROM cinemas WHERE city = 'Phnom Penh' AND state = 'Phnom Penh' AND country = 'Cambodia';"
    },
    "idx_theaters_cinema": {
        "table": "theaters",
        "columns": "(cinema_id)",
        "query": "SELECT * FROM theaters WHERE cinema_id = 1;"
    },
    "idx_screenings_movie_date": {
        "table": "screenings",
        "columns": "(movie_id, screening_date)",
        "query": "SELECT * FROM screenings WHERE movie_id = 1 AND screening_date = CURRENT_DATE;"
    },
    "idx_screenings_theater_date": {
        "table": "screenings",
        "columns": "(theater_id, screening_date)",
        "query": "SELECT * FROM screenings WHERE theater_id = 1 AND screening_date = CURRENT_DATE;"
    },
    "idx_customers_email": {
        "table": "customers",
        "columns": "(email)",
        "query": "SELECT * FROM customers WHERE email = 'test@example.com';"
    },
    "idx_customers_phone": {
        "table": "customers",
        "columns": "(phone)",
        "query": "SELECT * FROM customers WHERE phone = '+855123456789';"
    },
    "idx_bookings_customer": {
        "table": "bookings",
        "columns": "(customer_id)",
        "query": "SELECT * FROM bookings WHERE customer_id = 1;"
    },
    "idx_bookings_screening": {
        "table": "bookings",
        "columns": "(screening_id)",
        "query": "SELECT * FROM bookings WHERE screening_id = 1;"
    },
    "idx_bookings_date": {
        "table": "bookings",
        "columns": "(created_at)",
        "query": "SELECT * FROM bookings WHERE created_at >= CURRENT_DATE - INTERVAL '1 day';"
    },
    "idx_tickets_booking": {
        "table": "tickets",
        "columns": "(booking_id)",
        "query": "SELECT * FROM tickets WHERE booking_id = 1;"
    },
    "idx_tickets_seat": {
        "table": "tickets",
        "columns": "(seat_id)",
        "query": "SELECT * FROM tickets WHERE seat_id = 1;"
    },
    "idx_payments_booking": {
        "table": "payments",
        "columns": "(booking_id)",
        "query": "SELECT * FROM payments WHERE booking_id = 1;"
    },
    "idx_payments_status": {
        "table": "payments",
        "columns": "(status)",
        "query": "SELECT * FROM payments WHERE status = 'pending';"
    }
}

def run_test(cursor, query, runs=3):
    times = []
    for _ in range(runs):
        start = time.perf_counter()
        try:
            cursor.execute(query)
            cursor.fetchall()  # Ensure query completes
        except Exception as e:
            print(f"Query failed: {e}")
            return None
        end = time.perf_counter()
        times.append((end - start) * 1000)  # Convert to milliseconds
    return times

def write_results(results, filename='results_simple.csv'):
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
        
        for index_name, index_info in index_definitions.items():
            print(f"\nTesting {index_name}...")
            
            # Drop index if exists
            try:
                cursor.execute(f"DROP INDEX IF EXISTS {index_name};")
                conn.commit()
            except Exception as e:
                print(f"Failed to drop index: {e}")
                conn.rollback()
            
            # Test without index
            times_without = run_test(cursor, index_info["query"])
            if times_without:
                avg_without = sum(times_without) / len(times_without)
                results.append([
                    index_name,
                    'simple',
                    *times_without,
                    avg_without,
                    False,
                    index_info["query"]
                ])
            
            # Create index
            try:
                create_index_sql = f"CREATE INDEX {index_name} ON {index_info['table']} {index_info['columns']};"
                print(f"Creating index with: {create_index_sql}")
                cursor.execute(create_index_sql)
                conn.commit()
            except Exception as e:
                print(f"Failed to create index: {e}")
                conn.rollback()
                continue
            
            # Test with index
            times_with = run_test(cursor, index_info["query"])
            if times_with:
                avg_with = sum(times_with) / len(times_with)
                results.append([
                    index_name,
                    'simple',
                    *times_with,
                    avg_with,
                    True,
                    index_info["query"]
                ])
        
        write_results(results)
        print(f"\nResults have been written to {os.path.join(RESULTS_DIR, 'results_simple.csv')}")
        
    except Exception as e:
        print(f"Database connection failed: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main() 