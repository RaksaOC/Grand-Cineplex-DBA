import pandas as pd

import random
import string
import   # Replace with your database connector library (e.g., psycopg2 for PostgreSQL)

# Database connection details (replace with your credentials)
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "visal"
DB_NAME = "user"

# Function to generate random data (you can customize this)
def generate_data():
    
    name = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
    email = f"{name.lower()}@{random.randint(1, 100)}.com"
    age = random.randint(18, 65)
    country = random.choice(countries)
    return name, email, age, country

# Connect to the database
try:
    connection = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
    cursor = connection.cursor()
except mysql.connector.Error as err:
    print("Error connecting to database:", err)
    exit()

# Create table if it doesn't exist (replace with your table schema)
create_table_query = """
CREATE TABLE IF NOT EXISTS facebook_users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
age INT NOT NULL,
country VARCHAR(255) NOT NULL
)
"""
cursor.execute(create_table_query)
connection.commit()

# Generate and insert data
print('Start inserting ...')
insertion_amount = 100
num_records = 60000
i = 0
for k in range(insertion_amount):
    for _ in range(num_records):
        name, email, age, country = generate_data()
        insert_query = """
        INSERT INTO facebook_users (name, email, age, country)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (name, email, age, country))
    connection.commit()
    i = i + 1
    print('Insertion round', i, num_records, 'records.')

print(f"Successfully inserted {num_records*insertion_amount} records into the database.")

# Close the connection
cursor.close()
connection.close()

print('Finished inserting!!!')