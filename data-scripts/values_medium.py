VALUE_TYPE = "medium"

# TRUE FINAL VALUES (35% occupancy) ======================================================================

# FIXED VALUES ======================================================================
FIXED_CINEMAS = 5  # Total number of cinemas
FIXED_CUSTOMERS = 100_000  # Increased from 50k for more realistic usage
FIXED_MOVIES = 150  # Increased from 100 for more variety
FIXED_SCREENING_PER_DAY = 5  # Keeping as is for realistic schedule
FIXED_SEATS_PER_THEATER = 60  # Increased from 50 for better capacity
FIXED_SCREENING_DAYS = 30  # Keeping 30 days (1 month) period
FIXED_THEATERS_PER_CINEMA = 8  # Increased from 5 for more capacity
FIXED_STAFF_PER_CINEMA = 15  # Increased from 10 for larger operation

# {multiplier} values ======================================================================
BOOKINGS_PER_CUSTOMER = 10  # Adjusted from 15 to be more realistic
TICKETS_PER_BOOKING = 2  # Keeping as is - average 2 tickets per booking

# MAXIMUM VALUES ======================================================================
MAXIMUM_TICKETS_PER_DAY_PER_CINEMA_PER_MOVIE = FIXED_SCREENING_PER_DAY * FIXED_SEATS_PER_THEATER  # 5 * 60 = 300
MAXIMUM_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE = MAXIMUM_TICKETS_PER_DAY_PER_CINEMA_PER_MOVIE * FIXED_SCREENING_DAYS  # 300 * 30 = 9,000
MAXIMUM_TICKETS_PER_CINEMA = MAXIMUM_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE * FIXED_MOVIES  # 9,000 * 150 = 1,350,000
MAXIMUM_TICKETS_PER_LIFETIME = MAXIMUM_TICKETS_PER_CINEMA * FIXED_CINEMAS  # 1,350,000 * 5 = 6,750,000

# PURCHASED VALUES ======================================================================
PURCHASED_BOOKINGS = FIXED_CUSTOMERS * BOOKINGS_PER_CUSTOMER  # 100k * 10 = 1,000,000
PURCHASED_TICKETS = PURCHASED_BOOKINGS * TICKETS_PER_BOOKING  # 1M * 2 = 2,000,000

# OCCUPANCY RATE ======================================================================
OCCUPANCY_RATE = (PURCHASED_TICKETS / MAXIMUM_TICKETS_PER_LIFETIME) * 100  # ~35% occupancy

# ==========================================================================================================

# DATABASE VALUES ======================================================================
# these numbers will be used to automatically generate the database

CINEMAS = FIXED_CINEMAS  # 5
CUSTOMERS = FIXED_CUSTOMERS  # 100,000
MOVIES = FIXED_MOVIES  # 150
SCREENINGS = 200_000  # Calculated but rounded for simplicity
SEATS = FIXED_SEATS_PER_THEATER * FIXED_THEATERS_PER_CINEMA * FIXED_CINEMAS  # 60 * 8 * 5 = 2,400
BOOKINGS = PURCHASED_BOOKINGS  # 1,000,000
TICKETS = PURCHASED_TICKETS  # 2,000,000
STAFF = FIXED_STAFF_PER_CINEMA * FIXED_CINEMAS  # 15 * 5 = 75
THEATERS = FIXED_THEATERS_PER_CINEMA * FIXED_CINEMAS  # 8 * 5 = 40
PAYMENTS = BOOKINGS  # 1,000,000

# Calculated values
TOTAL_THEATERS = CINEMAS * FIXED_THEATERS_PER_CINEMA
TOTAL_SEATS = TOTAL_THEATERS * FIXED_SEATS_PER_THEATER
TOTAL_STAFF = CINEMAS * FIXED_STAFF_PER_CINEMA

