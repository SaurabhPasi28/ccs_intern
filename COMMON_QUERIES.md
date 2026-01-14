# 🔍 Common Tasks & SQL Queries - CCS Project

## 📋 Database Management

### 1️⃣ View All Users
```sql
SELECT 
    u.id,
    u.name,
    u.email,
    ut.name as user_type,
    u.is_verified,
    u.created_at
FROM users u
JOIN user_types ut ON u.user_type = ut.id
ORDER BY u.created_at DESC;
```

### 2️⃣ Count Users by Type
```sql
SELECT 
    ut.name as user_type,
    COUNT(u.id) as count
FROM user_types ut
LEFT JOIN users u ON ut.id = u.user_type
GROUP BY ut.name
ORDER BY count DESC;
```

### 3️⃣ Find Unverified Users
```sql
SELECT name, email, created_at
FROM users
WHERE is_verified = false
ORDER BY created_at DESC;
```

### 4️⃣ Manually Verify a User
```sql
UPDATE users
SET is_verified = true,
    verification_token = NULL
WHERE email = 'user@example.com';
```

### 5️⃣ Delete a User (and all related data)
```sql
-- This will CASCADE delete all related records
DELETE FROM users WHERE email = 'user@example.com';
```

### 6️⃣ Reset User Password Manually
```sql
-- Note: Password should be hashed! This is for testing only
-- Use bcrypt in backend for real password changes
UPDATE users
SET password = '$2b$10$...'  -- hashed password here
WHERE email = 'user@example.com';
```

### 7️⃣ View Complete Student Profile
```sql
SELECT 
    u.name,
    u.email,
    p.state,
    p.city,
    p.dob,
    p.bio,
    p.profile_image_url,
    p.banner_image_url
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'student@example.com';
```

### 8️⃣ View Student with Education
```sql
SELECT 
    u.name,
    u.email,
    e.degree,
    e.field_of_study,
    e.institution,
    e.start_year,
    e.end_year,
    e.is_current
FROM users u
LEFT JOIN education e ON u.id = e.user_id
WHERE u.email = 'student@example.com'
ORDER BY e.start_year DESC;
```

### 9️⃣ View Student with Skills
```sql
SELECT 
    u.name,
    u.email,
    STRING_AGG(s.skill_name, ', ') as skills
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN skills s ON us.skill_id = s.id
WHERE u.email = 'student@example.com'
GROUP BY u.name, u.email;
```

### 🔟 View All Colleges with Program Count
```sql
SELECT 
    c.name,
    c.city,
    c.state,
    c.established_year,
    COUNT(cp.id) as program_count
FROM colleges c
LEFT JOIN college_programs cp ON c.id = cp.college_id
GROUP BY c.id, c.name, c.city, c.state, c.established_year
ORDER BY program_count DESC;
```

---

## 🏢 College Management Queries

### 1️⃣ View College Details
```sql
SELECT 
    u.name as registered_by,
    u.email,
    c.*
FROM colleges c
JOIN users u ON c.user_id = u.id
WHERE u.email = 'college@example.com';
```

### 2️⃣ View College Programs
```sql
SELECT 
    c.name as college_name,
    cp.degree_level,
    cp.program_name,
    cp.specialization,
    cp.duration_years,
    cp.annual_fees,
    cp.total_seats
FROM college_programs cp
JOIN colleges c ON cp.college_id = c.id
WHERE c.name ILIKE '%MIT%'
ORDER BY cp.degree_level, cp.program_name;
```

### 3️⃣ View College Facilities
```sql
SELECT 
    c.name as college_name,
    STRING_AGG(cf.facility_name, ', ') as facilities
FROM colleges c
LEFT JOIN college_facilities cf ON c.id = cf.college_id
WHERE c.name ILIKE '%MIT%'
GROUP BY c.name;
```

### 4️⃣ View College Placement Stats
```sql
SELECT 
    c.name as college_name,
    cp.academic_year,
    cp.placement_percent,
    cp.average_package,
    cp.highest_package,
    cp.companies_visited,
    cp.top_recruiters
FROM college_placements cp
JOIN colleges c ON cp.college_id = c.id
ORDER BY c.name, cp.academic_year DESC;
```

### 5️⃣ Top Colleges by Highest Package
```sql
SELECT 
    c.name,
    c.city,
    c.state,
    MAX(cp.highest_package) as highest_package
FROM colleges c
JOIN college_placements cp ON c.id = cp.college_id
GROUP BY c.id, c.name, c.city, c.state
ORDER BY highest_package DESC
LIMIT 10;
```

---

## 🏭 Company Management Queries

### 1️⃣ View Company Details
```sql
SELECT 
    u.name as registered_by,
    u.email,
    co.*
FROM companies co
JOIN users u ON co.user_id = u.id
WHERE u.email = 'company@example.com';
```

### 2️⃣ View Company with All Locations
```sql
SELECT 
    c.name as company_name,
    STRING_AGG(CONCAT(cl.city, ', ', cl.state), ' | ') as locations
FROM companies c
LEFT JOIN company_locations cl ON c.id = cl.company_id
GROUP BY c.name;
```

### 3️⃣ View Company Tech Stack
```sql
SELECT 
    c.name as company_name,
    STRING_AGG(cts.technology, ', ') as tech_stack
FROM companies c
LEFT JOIN company_tech_stack cts ON c.id = cts.company_id
WHERE c.name ILIKE '%Tech Corp%'
GROUP BY c.name;
```

### 4️⃣ View Company Open Roles
```sql
SELECT 
    c.name as company_name,
    cr.role_name,
    cr.experience_level,
    cr.salary_range
FROM company_roles cr
JOIN companies c ON cr.company_id = c.id
WHERE c.name ILIKE '%Tech Corp%'
ORDER BY cr.experience_level, cr.role_name;
```

### 5️⃣ Companies by Industry
```sql
SELECT 
    industry,
    COUNT(*) as company_count
FROM companies
WHERE industry IS NOT NULL
GROUP BY industry
ORDER BY company_count DESC;
```

---

## 🧹 Cleanup & Maintenance Queries

### 1️⃣ Delete Old Unverified Users (> 7 days)
```sql
DELETE FROM users
WHERE is_verified = false
  AND created_at < NOW() - INTERVAL '7 days';
```

### 2️⃣ Clear Expired Password Reset Tokens
```sql
UPDATE users
SET reset_password_token = NULL,
    reset_password_expires = NULL
WHERE reset_password_expires < NOW();
```

### 3️⃣ Remove Orphaned Profiles (if any)
```sql
-- First check if any exist
SELECT p.id, p.user_id
FROM profiles p
LEFT JOIN users u ON p.user_id = u.id
WHERE u.id IS NULL;

-- If found, delete them
DELETE FROM profiles
WHERE user_id NOT IN (SELECT id FROM users);
```

### 4️⃣ Rebuild User Statistics
```sql
-- Count education entries per user
SELECT 
    u.name,
    u.email,
    COUNT(e.id) as education_count
FROM users u
LEFT JOIN education e ON u.id = e.user_id
GROUP BY u.id, u.name, u.email
HAVING COUNT(e.id) > 0
ORDER BY education_count DESC;
```

---

## 📊 Analytics Queries

### 1️⃣ User Registration Trends (Daily)
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as registrations
FROM users
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 2️⃣ Most Popular Skills
```sql
SELECT 
    s.skill_name,
    COUNT(us.user_id) as user_count
FROM skills s
JOIN user_skills us ON s.id = us.skill_id
GROUP BY s.skill_name
ORDER BY user_count DESC
LIMIT 20;
```

### 3️⃣ Average Years of Experience by User
```sql
SELECT 
    u.name,
    u.email,
    ROUND(AVG(
        EXTRACT(YEAR FROM AGE(
            COALESCE(e.end_date, CURRENT_DATE),
            e.start_date
        ))
    ), 1) as avg_years_experience
FROM users u
JOIN experience e ON u.id = e.user_id
WHERE e.start_date IS NOT NULL
GROUP BY u.id, u.name, u.email
HAVING COUNT(e.id) > 0
ORDER BY avg_years_experience DESC;
```

### 4️⃣ Colleges with Most Programs
```sql
SELECT 
    c.name,
    c.city,
    c.state,
    COUNT(cp.id) as program_count,
    STRING_AGG(DISTINCT cp.degree_level, ', ') as degree_levels
FROM colleges c
LEFT JOIN college_programs cp ON c.id = cp.college_id
GROUP BY c.id, c.name, c.city, c.state
ORDER BY program_count DESC;
```

### 5️⃣ User Activity Summary
```sql
SELECT 
    ut.name as user_type,
    COUNT(u.id) as total_users,
    COUNT(CASE WHEN u.is_verified THEN 1 END) as verified_users,
    ROUND(
        100.0 * COUNT(CASE WHEN u.is_verified THEN 1 END) / COUNT(u.id),
        2
    ) as verification_rate
FROM user_types ut
LEFT JOIN users u ON ut.id = u.user_type
GROUP BY ut.name
ORDER BY total_users DESC;
```

---

## 🔐 Security & Admin Queries

### 1️⃣ Find Users Who Changed Password Recently
```sql
SELECT 
    name,
    email,
    password_changed_at
FROM users
WHERE password_changed_at IS NOT NULL
ORDER BY password_changed_at DESC;
```

### 2️⃣ Find Users with Active Reset Tokens
```sql
SELECT 
    name,
    email,
    reset_password_expires
FROM users
WHERE reset_password_token IS NOT NULL
  AND reset_password_expires > NOW()
ORDER BY reset_password_expires;
```

### 3️⃣ Disable User Account
```sql
UPDATE users
SET status = false
WHERE email = 'user@example.com';
```

### 4️⃣ Enable User Account
```sql
UPDATE users
SET status = true
WHERE email = 'user@example.com';
```

### 5️⃣ Change User Type
```sql
UPDATE users
SET user_type = 3  -- 3 = student_professional
WHERE email = 'user@example.com';
```

---

## 🛠️ Development & Testing Queries

### 1️⃣ Create Test Student User (Direct Insert)
```sql
INSERT INTO users (name, email, password, user_type, is_verified)
VALUES (
    'Test Student',
    'teststudent@test.com',
    '$2b$10$abcdefghijklmnopqrstuvwxyz123456',  -- Use real bcrypt hash
    3,  -- student_professional
    true
);
```

### 2️⃣ Create Test Profile for User
```sql
INSERT INTO profiles (user_id, state, city, bio)
VALUES (
    (SELECT id FROM users WHERE email = 'teststudent@test.com'),
    'Karnataka',
    'Bangalore',
    'I am a passionate software developer'
);
```

### 3️⃣ Quick Add Skills to User
```sql
-- First ensure skills exist
INSERT INTO skills (skill_name)
VALUES ('JavaScript'), ('React'), ('Node.js')
ON CONFLICT (skill_name) DO NOTHING;

-- Then link to user
INSERT INTO user_skills (user_id, skill_id)
SELECT 
    (SELECT id FROM users WHERE email = 'teststudent@test.com'),
    id
FROM skills
WHERE skill_name IN ('JavaScript', 'React', 'Node.js');
```

### 4️⃣ Reset Database (DANGER!)
```sql
-- ⚠️ WARNING: This deletes ALL data!
-- Use only in development

-- Delete all users (cascades to all related tables)
DELETE FROM users;

-- Reset user_types (in case you modified them)
DELETE FROM user_types;
INSERT INTO user_types (id, name) VALUES
(1,'admin'),
(2,'subadmin'),
(3,'student_professional'),
(4,'college'),
(5,'university'),
(6,'school'),
(7,'company');

-- Reset sequences
ALTER SEQUENCE profiles_id_seq RESTART WITH 1;
ALTER SEQUENCE education_id_seq RESTART WITH 1;
ALTER SEQUENCE experience_id_seq RESTART WITH 1;
ALTER SEQUENCE skills_id_seq RESTART WITH 1;
ALTER SEQUENCE certifications_id_seq RESTART WITH 1;
ALTER SEQUENCE colleges_id_seq RESTART WITH 1;
```

---

## 🔎 Search Queries

### 1️⃣ Search Users by Name
```sql
SELECT name, email, is_verified
FROM users
WHERE name ILIKE '%john%'
ORDER BY name;
```

### 2️⃣ Search Colleges by Location
```sql
SELECT name, city, state, website_url
FROM colleges
WHERE city ILIKE '%bangalore%'
   OR state ILIKE '%karnataka%'
ORDER BY name;
```

### 3️⃣ Search Students by Skills
```sql
SELECT DISTINCT
    u.name,
    u.email,
    STRING_AGG(s.skill_name, ', ') as skills
FROM users u
JOIN user_skills us ON u.id = us.user_id
JOIN skills s ON us.skill_id = s.id
WHERE s.skill_name ILIKE '%javascript%'
   OR s.skill_name ILIKE '%react%'
GROUP BY u.id, u.name, u.email;
```

### 4️⃣ Search Companies by Industry
```sql
SELECT name, industry, city, state
FROM companies
WHERE industry ILIKE '%technology%'
   OR industry ILIKE '%IT%'
ORDER BY name;
```

### 5️⃣ Full-Text Search Across Profiles
```sql
SELECT 
    u.name,
    u.email,
    p.bio
FROM users u
JOIN profiles p ON u.id = p.user_id
WHERE p.bio ILIKE '%developer%'
   OR p.bio ILIKE '%engineer%'
ORDER BY u.name;
```

---

## 🐛 Debugging Queries

### 1️⃣ Check Foreign Key Relationships
```sql
-- View all foreign keys in database
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
```

### 2️⃣ Check Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 3️⃣ View Active Connections
```sql
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start
FROM pg_stat_activity
WHERE datname = 'CCS';
```

### 4️⃣ Find Slow Queries (if enabled)
```sql
-- Enable tracking first:
-- ALTER DATABASE CCS SET log_min_duration_statement = 1000;

SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 5️⃣ Check Indexes
```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 📝 Useful PostgreSQL Commands

### In psql (Command Line):

```sql
\l          -- List all databases
\c CCS      -- Connect to CCS database
\dt         -- List all tables
\d users    -- Describe users table structure
\du         -- List all users/roles
\q          -- Quit psql
```

### Export Data:
```sql
-- Export users to CSV
COPY (SELECT * FROM users) TO 'C:/temp/users.csv' WITH CSV HEADER;

-- Export with specific columns
COPY (SELECT name, email, is_verified FROM users) 
TO 'C:/temp/users_simple.csv' WITH CSV HEADER;
```

### Import Data:
```sql
-- Import from CSV
COPY users(name, email, password, user_type)
FROM 'C:/temp/users_import.csv' WITH CSV HEADER;
```

---

## 🎯 Quick Tips

1. **Always use ILIKE for case-insensitive search** (not LIKE)
2. **Use STRING_AGG** to combine multiple rows into one comma-separated value
3. **Use COALESCE** to handle NULL values
4. **Use ON CONFLICT** for upsert operations (insert or update)
5. **Always test DELETE queries with SELECT first**
6. **Use transactions for multiple related operations:**
   ```sql
   BEGIN;
   -- Your queries here
   COMMIT;  -- or ROLLBACK; if something went wrong
   ```

---

## 🚀 Performance Optimization

### Add Index for Frequent Searches:
```sql
-- If you frequently search users by email
CREATE INDEX idx_users_email ON users(email);

-- If you frequently join on user_type
CREATE INDEX idx_users_user_type ON users(user_type);

-- For text search on bio
CREATE INDEX idx_profiles_bio_gin ON profiles USING gin(to_tsvector('english', bio));
```

### Analyze Query Performance:
```sql
-- See query execution plan
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';
```

---

## 🎉 Common Scenarios

### Scenario 1: User forgot password, needs manual reset
```sql
-- 1. Generate new verification token (or use any random string)
-- 2. Update user
UPDATE users
SET is_verified = true,
    verification_token = NULL
WHERE email = 'user@example.com';
```

### Scenario 2: Merge duplicate skills
```sql
-- Keep skill_id 5, merge skill_id 10 into it
UPDATE user_skills
SET skill_id = 5
WHERE skill_id = 10;

-- Delete duplicate
DELETE FROM skills WHERE id = 10;
```

### Scenario 3: Backup specific user data
```sql
-- Export one user's complete data
SELECT 
    'users' as table_name,
    row_to_json(u.*) as data
FROM users u
WHERE u.email = 'user@example.com'

UNION ALL

SELECT 
    'profiles',
    row_to_json(p.*)
FROM profiles p
WHERE p.user_id = (SELECT id FROM users WHERE email = 'user@example.com')

-- Add more tables as needed...
```

---

Save this file and refer to it whenever you need to work with the database! 🎯
