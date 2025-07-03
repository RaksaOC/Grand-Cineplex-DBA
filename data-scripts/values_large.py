VALUE_TYPE = "large"

# TRUE FINAL VALUES (20% occupancy) ======================================================================

# FIXED VALUES ======================================================================
FIXED_CINEMAS = 5  # Total number of cinemas
FIXED_CUSTOMERS = 500000  # Total number of customers
FIXED_MOVIES = 300  # Total number of movies
FIXED_SCREENING_PER_DAY = 5 # Total number of screenings per day
FIXED_SEATS_PER_THEATER = 100 # Total number of seats per theater
FIXED_SCREENING_DAYS = 100 # Total number of screening days
FIXED_THEATERS_PER_CINEMA = 15 # Total number of theaters per cinema
FIXED_STAFF_PER_CINEMA = 20 # Total number of staff per cinema

# {multiplier} values ======================================================================
BOOKINGS_PER_CUSTOMER = 15 # Total number of bookings per customer
TICKETS_PER_BOOKING = 2 # Total number of tickets per booking

# MAXIMUM VALUES ======================================================================
MAXIMUM_TICKETS_PER_DAY_PER_CINEMA_PER_MOVIE = FIXED_SCREENING_PER_DAY * FIXED_SEATS_PER_THEATER # 5 * 100 = 500
MAXIMUM_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE = MAXIMUM_TICKETS_PER_DAY_PER_CINEMA_PER_MOVIE * FIXED_SCREENING_DAYS # 500 * 100 = 50,000
MAXIMUM_TICKETS_PER_CINEMA = MAXIMUM_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE * FIXED_MOVIES # 50,000 * 300 = 15,000,000
MAXIMUM_TICKETS_PER_LIFETIME = MAXIMUM_TICKETS_PER_CINEMA * FIXED_CINEMAS # 15,000,000 * 5 = 75,000,000

# PURCHASED VALUES ======================================================================
PURCHASED_BOOKINGS = FIXED_CUSTOMERS * BOOKINGS_PER_CUSTOMER # Total number of bookings each customer book 15 times = 7,500,000
PURCHASED_TICKETS = PURCHASED_BOOKINGS * TICKETS_PER_BOOKING # Total number of tickets each booking has 2 tickets = 15,000,000

# OCCUPANCY RATE ======================================================================
OCCUPANCY_RATE = (PURCHASED_TICKETS / MAXIMUM_TICKETS_PER_LIFETIME) * 100 # 20% occupancy

# ==========================================================================================================

# DATABASE VALUES ======================================================================
# these numbers will be used to automatically generate the database

CINEMAS = FIXED_CINEMAS # 5
CUSTOMERS = FIXED_CUSTOMERS # 500,000
MOVIES = FIXED_MOVIES # 300
SCREENINGS = FIXED_SCREENING_PER_DAY * FIXED_SCREENING_DAYS * FIXED_MOVIES * FIXED_CINEMAS # 5 * 100 * 300 * 5 = 750,000
SEATS = FIXED_SEATS_PER_THEATER * FIXED_THEATERS_PER_CINEMA * FIXED_CINEMAS # 100 * 15 * 5 = 7,500
BOOKINGS = PURCHASED_BOOKINGS # 7,500,000
TICKETS = PURCHASED_TICKETS # 15,000,000
STAFF = FIXED_STAFF_PER_CINEMA * FIXED_CINEMAS # 20 * 5 = 100
THEATERS = FIXED_THEATERS_PER_CINEMA * FIXED_CINEMAS # 15 * 5 = 75
PAYMENTS = BOOKINGS # 7,500,000

