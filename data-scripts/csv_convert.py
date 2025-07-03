from faker import Faker
import pandas as pd
import random
from datetime import datetime, timedelta

# change the values file to the one you want to use

from values_medium import *
# from values_large import *
# from values_small import *

fake = Faker()
Faker.seed(42)
random.seed(42)

def getDirPath(value_type):
    return f"csv_{value_type}"

# Helper function to generate timestamps
def get_timestamps():
    created = fake.date_time_between(start_date='-1y', end_date='now')
    updated = fake.date_time_between(start_date=created, end_date='now')
    return created, updated

print("🎬 Starting data generation...")

# 1. Cinemas
print("\n📍 Generating cinemas...")
cinemas = []
for i in range(CINEMAS):
    created, updated = get_timestamps()
    cinemas.append({
        "id": i + 1,
        "name": f"Cinema {i + 1}",
        "address": fake.address(),
        "city": fake.city(),
        "state": fake.state(),
        "country": fake.country(),
        "phone": fake.phone_number()[:20],
        "email": fake.company_email() + str(i), # to remove possible duplicates
        "is_active": True,
        "created_at": created,
        "updated_at": updated
    })
pd.DataFrame(cinemas).to_csv(getDirPath(VALUE_TYPE) + "/cinemas.csv", index=False)
print("✅ Cinemas generated")

# 2. Movies
print("\n🎥 Generating movies...")
movies = []
for i in range(MOVIES):
    created, updated = get_timestamps()
    movies.append({
        "id": i + 1,
        "title": fake.catch_phrase(),
        "description": fake.text(max_nb_chars=200),
        "duration": random.randint(80, 180),
        "genre": random.choice(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi']),
        "rating": random.choice(['G', 'PG', 'PG-13', 'R']),
        "poster_url": f"https://example.com/posters/movie_{i+1}.jpg",
        "release_date": fake.date_between(start_date='-1y', end_date='+6m'),
        "created_at": created,
        "updated_at": updated
    })
pd.DataFrame(movies).to_csv(getDirPath(VALUE_TYPE) + "/movies.csv", index=False)
print("✅ Movies generated")

# 3. Theaters
print("\n🏛️ Generating theaters...")
theaters = []
for cinema in cinemas:
    for i in range(FIXED_THEATERS_PER_CINEMA):
        created, updated = get_timestamps()
        theaters.append({
            "id": len(theaters) + 1,
            "name": f"Theater {i + 1}",
            "cinema_id": cinema["id"],
            "created_at": created,
            "updated_at": updated
        })
pd.DataFrame(theaters).to_csv(getDirPath(VALUE_TYPE) + "/theaters.csv", index=False)
print("✅ Theaters generated")

# 4. Seats
print("\n💺 Generating seats...")
seat_id = 1
seats = []
for theater in theaters:
    for row in range(10):  # 10 rows
        for seat_num in range(10):  # 10 seats per row
            created, updated = get_timestamps()
            seats.append({
                "id": seat_id,
                "theater_id": theater["id"],
                "row_number": chr(65 + row),  # A, B, C, etc.
                "seat_number": seat_num + 1,
                "seat_type": random.choice(['regular', 'premium', 'vip']),
                "created_at": created,
                "updated_at": updated
            })
            seat_id += 1
            if seat_id % 1000 == 0:
                print(f"Generated {seat_id} seats...")
pd.DataFrame(seats).to_csv(getDirPath(VALUE_TYPE) + "/seats.csv", index=False)
print("✅ Seats generated")

# 5. Customers
print("\n👥 Generating customers...")
customers = []
for i in range(CUSTOMERS):
    created, updated = get_timestamps()
    customers.append({
        "id": i + 1,
        "name": fake.name(),
        "email": fake.email() + str(i), # to remove possible duplicates
        "phone": fake.phone_number()[:20],
        "password": fake.sha256(),  # Hashed password
        "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=80),
        "created_at": created,
        "updated_at": updated
    })
    if (i + 1) % 50000 == 0:
        print(f"Generated {i + 1} customers...")
pd.DataFrame(customers).to_csv(getDirPath(VALUE_TYPE) + "/customers.csv", index=False)
print("✅ Customers generated")

# 6. Staff
print("\n👨‍💼 Generating staff...")
staff = []
for cinema in cinemas:
    for i in range(FIXED_STAFF_PER_CINEMA):
        created, updated = get_timestamps()
        hired_date = fake.date_between(start_date='-2y', end_date='today')
        staff.append({
            "id": len(staff) + 1,
            "name": fake.name(),
            "email": fake.email() + str(i), # to remove possible duplicates
            "password": fake.sha256(),
            "role": random.choice(['cashier', 'admin', 'manager']),
            "phone": fake.phone_number()[:20],
            "hired_date": hired_date,
            "is_active": True,
            "created_at": created,
            "updated_at": updated
        })
pd.DataFrame(staff).to_csv(getDirPath(VALUE_TYPE) + "/staff.csv", index=False)
print("✅ Staff generated")

# 7. Screenings
print("\n🎦 Generating screenings...")
screenings = []
base_date = datetime.now().date()
for i in range(SCREENINGS):
    created, updated = get_timestamps()
    screening_date = base_date + timedelta(days=random.randint(0, 30))
    screening_time = f"{random.randint(10, 22):02d}:00:00"
    screenings.append({
        "id": i + 1,
        "movie_id": random.randint(1, MOVIES),
        "theater_id": random.randint(1, len(theaters)),
        "screening_date": screening_date,
        "screening_time": screening_time,
        "price": random.choice([10.00, 12.50, 15.00, 20.00]),
        "created_at": created,
        "updated_at": updated
    })
    if (i + 1) % 100000 == 0:
        print(f"Generated {i + 1} screenings...")
pd.DataFrame(screenings).to_csv(getDirPath(VALUE_TYPE) + "/screenings.csv", index=False)
print("✅ Screenings generated")

# 8. Bookings
print("\n📝 Generating bookings...")
bookings = []
for i in range(BOOKINGS):
    created, updated = get_timestamps()
    bookings.append({
        "id": i + 1,
        "customer_id": random.randint(1, CUSTOMERS),
        "screening_id": random.randint(1, SCREENINGS),
        "status": 'confirmed',
        "created_by_staff_id": random.randint(1, len(staff)) if random.random() < 0.3 else None,
        "created_at": created,
        "updated_at": updated
    })
    if (i + 1) % 100000 == 0:
        print(f"Generated {i + 1} bookings...")
# Convert to DataFrame with explicit Int64 type for created_by_staff_id
df_bookings = pd.DataFrame(bookings)
df_bookings['created_by_staff_id'] = df_bookings['created_by_staff_id'].astype('Int64')
df_bookings.to_csv(getDirPath(VALUE_TYPE) + "/bookings.csv", index=False)
print("✅ Bookings generated")

# 9. Tickets
print("\n🎟️ Generating tickets...")
tickets = []
for i in range(TICKETS):
    created = fake.date_time_between(start_date='-1y', end_date='now')
    booking_id = random.randint(1, BOOKINGS)
    tickets.append({
        "id": i + 1,
        "booking_id": booking_id,
        "seat_id": random.randint(1, len(seats)),
        "created_at": created
    })
    if (i + 1) % 1_000_000 == 0:
        print(f"Generated {i + 1} tickets...")
pd.DataFrame(tickets).to_csv(getDirPath(VALUE_TYPE) + "/tickets.csv", index=False)
print("✅ Tickets generated")

# 10. Payments
print("\n💳 Generating payments...")
payments = []
for i in range(PAYMENTS):
    created, updated = get_timestamps()
    payments.append({
        "id": i + 1,
        "booking_id": i + 1,
        "amount": random.choice([20.00, 25.00, 30.00, 40.00]),  # Based on ticket prices
        "method": random.choice(['cash', 'card', 'digital_wallet', 'bank_transfer']),
        "status": 'completed',
        "created_at": created,
        "updated_at": updated
    })
    if (i + 1) % 1_000_000 == 0:
        print(f"Generated {i + 1} payments...")
pd.DataFrame(payments).to_csv(getDirPath(VALUE_TYPE) + "/payments.csv", index=False)
print("✅ Payments generated")

print("\n🎉 All CSVs generated successfully!")