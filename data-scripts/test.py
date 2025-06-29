# fixed values ======================================================================

SCREENING_DAYS = 100  # Number of days for screenings
SCREENING_PER_DAY = 5  # Number of screenings per day

CINEMAS = 5  # Total number of cinemas
CUSTOMERS = 500000  # Total number of customers
BOOKINGS = CUSTOMERS * 15 # Total number of bookings each customer book 15 times 
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
# TICKETS/SOLD_TICKETS = 1,000,000
# POSSIBLE_TICKETS = 1,000,000 * 2 = 2,000,000
# SCREENINGS = 300 * 5 * 100 * 5 = 750,000 
# STAFF = 50 * 5 = 250
# SEATS = 100 * 15 * 5 = 7,500 (FIXED: was 20,000)
# THEATERS = 15 * 10 = 150

# TOTAL BUYABLE SEATS = 7,500

# NEW CALCULATIONS (based on possible tickets(per day, per 3 months, per cinema, per lifetime)) ======================================================================

LIFETIME_MOVIES = 300;

POSSIBLE_TICKETS_PER_DAY_PER_CINEMA_PER_MOVIE = SCREENING_PER_DAY * SEATS_PER_THEATER # 5 * 100 = 500
POSSIBLE_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE  = POSSIBLE_TICKETS_PER_DAY_PER_CINEMA_PER_MOVIE * SCREENING_DAYS # 500 * 100 = 50,000    
POSSIBLE_TICKETS_PER_CINEMA = POSSIBLE_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE * LIFETIME_MOVIES # 50,000 * 300 = 15,000,000
POSSIBLE_TICKETS_PER_LIFETIME = POSSIBLE_TICKETS_PER_CINEMA * CINEMAS # 15,000,000 * 5 = 75,000,000

POSSIBLE_TICKETS_PER_CINEMA_PER_MOVIE = POSSIBLE_TICKETS_PER_3_MONTHS_PER_CINEMA_PER_MOVIE * SCREENING_DAYS # 50,000 * 100 = 5,000,000
POSSIBLE_TICKETS_PER_LIFETIME_PER_MOVIE = POSSIBLE_TICKETS_PER_CINEMA_PER_MOVIE * CUSTOMERS # 5,000,000 * 500,000 = 2,500,000,000,000
POSSIBLE_TICKETS_PER_LIFETIME_PER_CINEMA_PER_MOVIE = POSSIBLE_TICKETS_PER_LIFETIME_PER_MOVIE / CINEMAS # 2,500,000,000,000 / 5 = 500,000,000,000

# # REALISTIC CUSTOMER BEHAVIOR SCENARIOS ======================================================================

# # Scenario 1: Conservative (your current estimate)
# CONSERVATIVE_BOOKINGS_PER_CUSTOMER = 10
# CONSERVATIVE_TICKETS_PER_BOOKING = 2
# CONSERVATIVE_TOTAL_TICKETS = CUSTOMERS * CONSERVATIVE_BOOKINGS_PER_CUSTOMER * CONSERVATIVE_TICKETS_PER_BOOKING
# CONSERVATIVE_UTILIZATION = CONSERVATIVE_TOTAL_TICKETS / POSSIBLE_TICKETS_PER_LIFETIME

# # Scenario 2: Moderate (more realistic)
# MODERATE_BOOKINGS_PER_CUSTOMER = 25  # Average customer goes to movies 25 times in their "lifetime"
# MODERATE_TICKETS_PER_BOOKING = 2.5   # Average of 2.5 tickets per booking (some solo, some groups)
# MODERATE_TOTAL_TICKETS = CUSTOMERS * MODERATE_BOOKINGS_PER_CUSTOMER * MODERATE_TICKETS_PER_BOOKING
# MODERATE_UTILIZATION = MODERATE_TOTAL_TICKETS / POSSIBLE_TICKETS_PER_LIFETIME

# # Scenario 3: Optimistic (high movie-going culture)
# OPTIMISTIC_BOOKINGS_PER_CUSTOMER = 50  # Movie enthusiasts
# OPTIMISTIC_TICKETS_PER_BOOKING = 3     # More group bookings
# OPTIMISTIC_TOTAL_TICKETS = CUSTOMERS * OPTIMISTIC_BOOKINGS_PER_CUSTOMER * OPTIMISTIC_TICKETS_PER_BOOKING
# OPTIMISTIC_UTILIZATION = OPTIMISTIC_TOTAL_TICKETS / POSSIBLE_TICKETS_PER_LIFETIME

# # REALISTIC CAPACITY CONSIDERATIONS ======================================================================

# # Realistic daily capacity (assuming staggered movie releases)
# REALISTIC_MOVIES_RUNNING_SIMULTANEOUSLY = 50  # At any given time, ~50 movies are showing
# REALISTIC_DAILY_CAPACITY = REALISTIC_MOVIES_RUNNING_SIMULTANEOUSLY * SCREENING_PER_DAY * SEATS_PER_THEATER * THEATERS_PER_CINEMA * CINEMAS
# REALISTIC_YEARLY_CAPACITY = REALISTIC_DAILY_CAPACITY * 365

# # Adjusted utilization rates with realistic capacity
# CONSERVATIVE_REALISTIC_UTILIZATION = CONSERVATIVE_TOTAL_TICKETS / REALISTIC_YEARLY_CAPACITY
# MODERATE_REALISTIC_UTILIZATION = MODERATE_TOTAL_TICKETS / REALISTIC_YEARLY_CAPACITY
# OPTIMISTIC_REALISTIC_UTILIZATION = OPTIMISTIC_TOTAL_TICKETS / REALISTIC_YEARLY_CAPACITY






