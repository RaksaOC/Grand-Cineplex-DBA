# fixed values ======================================================================

SCREENING_DAYS = 100  # Number of days for screenings
SCREENING_PER_DAY = 5  # Number of screenings per day

CINEMAS = 5  # Total number of cinemas
CUSTOMERS = 500000  # Total number of customers
BOOKINGS = 5000000  # Total number of bookings
MOVIES = 300  # Total number of movies

THEATERS_PER_CINEMA = 15  # Number of theaters in each cinema
SEATS_PER_THEATER = 100  # Number of seats in each theater
STAFF_PER_CINEMA = 50  # Number of staff members per cinema

# total  ======================================================================

PAYMENTS = BOOKINGS  # Total payments equals total bookings
TICKETS = BOOKINGS * 2  # Total tickets is double the bookings (assuming avg 2 tickets per booking)
SCREENINGS = MOVIES * SCREENING_PER_DAY * SCREENING_DAYS * CINEMAS  # Total screenings = movies × screenings/day × days × cinemas
STAFF = STAFF_PER_CINEMA * CINEMAS  # Total staff = staff per cinema × number of cinemas
SEATS = SEATS_PER_THEATER * THEATERS_PER_CINEMA * CINEMAS  # Total seats = seats per theater × theaters per cinema × number of cinemas
THEATERS = THEATERS_PER_CINEMA * CINEMAS  # Total theaters = theaters per cinema × number of cinemas

# expected values ======================================================================

# PAYMENTS = 500,000
# TICKETS = 1,000,000
# SCREENINGS = 300 * 5 * 100 * 5 = 750,000 
# STAFF = 50 * 5 = 250
# SEATS = 100 * 15 * 5 = 7,500 (FIXED: was 20,000)
# THEATERS = 15 * 10 = 150

# TOTAL BUYABLE SEATS = 7,500

