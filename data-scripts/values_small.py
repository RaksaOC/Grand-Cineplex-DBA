VALUE_TYPE = "small"

# TRUE FINAL VALUES (20% occupancy) ======================================================================

# FIXED VALUES ======================================================================
FIXED_CINEMAS = 5  # Total number of cinemas
FIXED_CUSTOMERS = 50_000  # Total number of customers
FIXED_MOVIES = 100  # Total number of movies
FIXED_SCREENING_PER_DAY = 5 # Total number of screenings per day
FIXED_SEATS_PER_THEATER = 50 # Total number of seats per theater
FIXED_SCREENING_DAYS = 30 # Total number of screening days
FIXED_THEATERS_PER_CINEMA = 5 # Total number of theaters per cinema
FIXED_STAFF_PER_CINEMA = 10 # Total number of staff per cinema

# {multiplier} values ======================================================================
BOOKINGS_PER_CUSTOMER = 15 # Total number of bookings per customer
TICKETS_PER_BOOKING = 2 # Total number of tickets per booking

# MAXIMUM VALUES ======================================================================
MAXIMUM_TICKETS_PER_DAY_PER_CINEMA_PER_MOVIE = FIXED_SCREENING_PER_DAY * FIXED_SEATS_PER_THEATER # 5 * 50 = 250
MAXIMUM_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE = MAXIMUM_TICKETS_PER_DAY_PER_CINEMA_PER_MOVIE * FIXED_SCREENING_DAYS # 250 * 30 = 7,500
MAXIMUM_TICKETS_PER_CINEMA = MAXIMUM_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE * FIXED_MOVIES # 7,500 * 100 = 750,000
MAXIMUM_TICKETS_PER_LIFETIME = MAXIMUM_TICKETS_PER_CINEMA * FIXED_CINEMAS # 750,000 * 5 = 3,750,000

# PURCHASED VALUES ======================================================================
PURCHASED_BOOKINGS = FIXED_CUSTOMERS * BOOKINGS_PER_CUSTOMER # Total number of bookings each customer book 15 times = 750,000
PURCHASED_TICKETS = PURCHASED_BOOKINGS * TICKETS_PER_BOOKING # Total number of tickets each booking has 2 tickets = 1,500,000

# OCCUPANCY RATE ======================================================================
OCCUPANCY_RATE = (PURCHASED_TICKETS / MAXIMUM_TICKETS_PER_LIFETIME) * 100 # 20% occupancy

# ==========================================================================================================

# DATABASE VALUES ======================================================================
# these numbers will be used to automatically generate the database

CINEMAS = 5  # Keeping small as it's the root of many relationships
CUSTOMERS = 50_000  # Reduced from 500_000
MOVIES = 100  # Reduced from 300
SCREENINGS = 100_000  # Reduced from 750_000
SEATS = FIXED_SEATS_PER_THEATER * FIXED_THEATERS_PER_CINEMA * FIXED_CINEMAS # 50 * 5 * 5 = 1,250
BOOKINGS = 500_000  # Reduced from 7.5M
TICKETS = 1_000_000  # Reduced from 15M
STAFF = FIXED_STAFF_PER_CINEMA * FIXED_CINEMAS # 10 * 5 = 50
THEATERS = FIXED_THEATERS_PER_CINEMA * FIXED_CINEMAS # 5 * 5 = 25
PAYMENTS = BOOKINGS  # Matches bookings count

# Calculated values
TOTAL_THEATERS = CINEMAS * FIXED_THEATERS_PER_CINEMA
TOTAL_SEATS = TOTAL_THEATERS * FIXED_SEATS_PER_THEATER
TOTAL_STAFF = CINEMAS * FIXED_STAFF_PER_CINEMA

