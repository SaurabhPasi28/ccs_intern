# Database Migration Guide - School & University Profiles

## Quick Setup

### Step 1: Apply the Schema
Run this in your PostgreSQL database:

```bash
# If using psql command line
psql -U your_username -d CCS -f backend/school_university_schema.sql

# Or connect to your database and run:
\i backend/school_university_schema.sql
```

### Step 2: Verify Tables Created
Check if all tables were created successfully:

```sql
-- List all tables
\dt

-- Check schools table
SELECT * FROM schools LIMIT 1;

-- Check universities table
SELECT * FROM universities LIMIT 1;

-- Check related tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'school_%' OR table_name LIKE 'university_%';
```

### Expected Tables

You should see these new tables:
- `schools`
- `school_facilities`
- `school_programs`
- `school_achievements`
- `school_results`
- `universities`
- `university_departments`
- `university_programs`
- `university_facilities`
- `university_placements`
- `university_rankings`
- `university_research`

## Sample Data (Optional)

### Insert Sample School Data

```sql
-- Insert a sample school user first (adjust based on your users table)
INSERT INTO users (name, email, password, user_type, is_verified) 
VALUES ('Green Valley School', 'contact@greenvalley.edu', 'hashed_password', 6, true)
RETURNING id;

-- Use the returned user_id in the next query
INSERT INTO schools (
    user_id, 
    name, 
    established_year, 
    board, 
    school_type, 
    grade_levels, 
    state, 
    city, 
    phone, 
    email, 
    website_url,
    principal_name,
    student_strength,
    teacher_count
) VALUES (
    'USER_ID_FROM_ABOVE',
    'Green Valley School',
    2005,
    'CBSE',
    'Private',
    'Pre-K to 12',
    'Karnataka',
    'Bangalore',
    '+91-80-12345678',
    'contact@greenvalley.edu',
    'https://greenvalley.edu',
    'Dr. Rajesh Kumar',
    1200,
    85
);
```

### Insert Sample University Data

```sql
-- Insert a sample university user first
INSERT INTO users (name, email, password, user_type, is_verified) 
VALUES ('Tech University', 'info@techuni.edu', 'hashed_password', 5, true)
RETURNING id;

-- Use the returned user_id
INSERT INTO universities (
    user_id,
    name,
    established_year,
    university_type,
    accreditation,
    state,
    city,
    phone,
    email,
    website_url,
    vice_chancellor_name,
    total_students,
    total_faculty,
    campus_area,
    referral_code
) VALUES (
    'USER_ID_FROM_ABOVE',
    'Tech University',
    1995,
    'Private',
    'NAAC A++',
    'Maharashtra',
    'Pune',
    '+91-20-87654321',
    'info@techuni.edu',
    'https://techuni.edu',
    'Prof. Dr. Amit Sharma',
    15000,
    450,
    '200 acres',
    '123456'
);
```

## Rollback Instructions

If you need to remove these tables:

```sql
-- Drop all school-related tables
DROP TABLE IF EXISTS school_results CASCADE;
DROP TABLE IF EXISTS school_achievements CASCADE;
DROP TABLE IF EXISTS school_programs CASCADE;
DROP TABLE IF EXISTS school_facilities CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- Drop all university-related tables
DROP TABLE IF EXISTS university_research CASCADE;
DROP TABLE IF EXISTS university_rankings CASCADE;
DROP TABLE IF EXISTS university_placements CASCADE;
DROP TABLE IF EXISTS university_facilities CASCADE;
DROP TABLE IF EXISTS university_programs CASCADE;
DROP TABLE IF EXISTS university_departments CASCADE;
DROP TABLE IF EXISTS universities CASCADE;
```

## Common Issues & Solutions

### Issue 1: Foreign Key Constraint Error
**Error**: `violates foreign key constraint "schools_user_id_fkey"`

**Solution**: Make sure you have a valid user with `user_type = 6` (school) or `user_type = 5` (university) before creating school/university profiles.

### Issue 2: Unique Constraint on Referral Code
**Error**: `duplicate key value violates unique constraint "universities_referral_code_key"`

**Solution**: The referral code is auto-generated. If you're manually inserting data, make sure to use a unique 6-digit code.

### Issue 3: State/City Not in Dropdown
**Solution**: Add the state/city to the `STATES_AND_CITIES` object in:
`frontend/src/components/data/statesAndCities.js`

## Testing Endpoints

Use these curl commands to test the API:

### Get School Profile
```bash
curl -X GET http://localhost:5000/api/school \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update School
```bash
curl -X PUT http://localhost:5000/api/school \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Green Valley School",
    "board": "CBSE",
    "school_type": "Private"
  }'
```

### Add School Facility
```bash
curl -X POST http://localhost:5000/api/school/facilities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"facility_name": "Library"}'
```

### Get University Profile
```bash
curl -X GET http://localhost:5000/api/university \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add University Department
```bash
curl -X POST http://localhost:5000/api/university/departments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "department_name": "Computer Science",
    "hod_name": "Dr. John Doe"
  }'
```

## Indexes Created

The schema includes these indexes for performance:
- `idx_schools_user_id`
- `idx_school_facilities_school_id`
- `idx_school_programs_school_id`
- `idx_school_achievements_school_id`
- `idx_school_results_school_id`
- `idx_universities_user_id`
- `idx_universities_referral_code`
- `idx_university_departments_university_id`
- `idx_university_programs_university_id`
- `idx_university_facilities_university_id`
- `idx_university_placements_university_id`
- `idx_university_rankings_university_id`
- `idx_university_research_university_id`

## Production Deployment Checklist

- [ ] Backup existing database before applying schema
- [ ] Test schema on development/staging environment first
- [ ] Verify all indexes are created
- [ ] Check foreign key constraints are working
- [ ] Test image upload directories exist (`uploads/school/`, `uploads/university/`)
- [ ] Verify Sharp and Multer dependencies are installed
- [ ] Test all API endpoints
- [ ] Run frontend build and check for any errors
- [ ] Set appropriate file size limits in Multer config
- [ ] Configure proper CORS settings for production
- [ ] Set up proper error logging

## Monitoring Queries

### Check Profile Counts
```sql
SELECT 
    (SELECT COUNT(*) FROM schools) as total_schools,
    (SELECT COUNT(*) FROM universities) as total_universities;
```

### Most Active Schools (by facilities count)
```sql
SELECT s.name, COUNT(sf.id) as facility_count
FROM schools s
LEFT JOIN school_facilities sf ON s.id = sf.school_id
GROUP BY s.id, s.name
ORDER BY facility_count DESC
LIMIT 10;
```

### Universities by Placement Rate
```sql
SELECT u.name, up.academic_year, up.placement_percent
FROM universities u
JOIN university_placements up ON u.id = up.university_id
ORDER BY up.placement_percent DESC;
```

---

**Need Help?** Check the main implementation guide in `PROFILE_PAGES_IMPLEMENTATION.md`
