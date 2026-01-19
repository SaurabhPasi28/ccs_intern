# 🔍 SQL Queries - UUID Schema (Updated Jan 2026)

## 📋 User Management Queries

### 1️⃣ View All Users with Type
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
GROUP BY ut.id, ut.name
ORDER BY count DESC;
```

### 3️⃣ Find Unverified Users
```sql
SELECT 
    id,
    name, 
    email, 
    created_at
FROM users
WHERE is_verified = false
ORDER BY created_at DESC;
```

### 4️⃣ Verify a User
```sql
UPDATE users
SET is_verified = true,
    verification_token = NULL
WHERE email = 'user@example.com';
```

### 5️⃣ Delete a User (Cascades all related data)
```sql
DELETE FROM users 
WHERE email = 'user@example.com';
```

### 6️⃣ Find Users Referred by a College
```sql
SELECT 
    u.id,
    u.name,
    u.email,
    c.name as referrer_college,
    u.created_at
FROM users u
LEFT JOIN colleges c ON u.referred_by_college_id = c.id
WHERE u.referred_by_college_id IS NOT NULL
ORDER BY u.created_at DESC;
```

---

## 👤 Student Profile Queries

### 1️⃣ View Complete Student Profile
```sql
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    p.id as profile_id,
    p.state,
    p.city,
    p.dob,
    p.bio,
    p.profile_image_url,
    p.banner_image_url,
    p.created_at
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'student@example.com';
```

### 2️⃣ View Student Education History
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

### 3️⃣ View Student Experience
```sql
SELECT 
    u.name,
    u.email,
    ex.title,
    ex.company,
    ex.start_date,
    ex.end_date,
    ex.is_current,
    ex.description
FROM users u
LEFT JOIN experience ex ON u.id = ex.user_id
WHERE u.email = 'student@example.com'
ORDER BY ex.start_date DESC;
```

### 4️⃣ View Student Skills
```sql
SELECT 
    u.id,
    u.name,
    u.email,
    STRING_AGG(s.skill_name, ', ' ORDER BY s.skill_name) as skills
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN skills s ON us.skill_id = s.id
WHERE u.email = 'student@example.com'
GROUP BY u.id, u.name, u.email;
```

### 5️⃣ View Student Certifications
```sql
SELECT 
    u.name,
    u.email,
    c.name as certification_name,
    c.issuing_organization,
    c.issue_date,
    c.expiry_date,
    c.credential_url
FROM users u
LEFT JOIN certifications c ON u.id = c.user_id
WHERE u.email = 'student@example.com'
ORDER BY c.issue_date DESC;
```

### 6️⃣ Full Student Profile Summary
```sql
SELECT 
    u.id,
    u.name,
    u.email,
    p.bio,
    p.state,
    p.city,
    p.dob,
    COUNT(DISTINCT e.id) as education_count,
    COUNT(DISTINCT ex.id) as experience_count,
    COUNT(DISTINCT us.skill_id) as skill_count,
    COUNT(DISTINCT cert.id) as certification_count
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN education e ON u.id = e.user_id
LEFT JOIN experience ex ON u.id = ex.user_id
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN certifications cert ON u.id = cert.user_id
WHERE u.email = 'student@example.com'
GROUP BY u.id, u.name, u.email, p.bio, p.state, p.city, p.dob;
```

---

## 🏫 College Profile Queries

### 1️⃣ View College Details
```sql
SELECT 
    c.id,
    c.name,
    c.logo_url,
    c.banner_url,
    c.established_year,
    c.accreditation,
    c.state,
    c.city,
    c.address,
    c.phone,
    c.email,
    c.website_url,
    c.hod_name,
    c.hod_email,
    c.hod_phone,
    c.hod_designation,
    c.referral_code,
    u.email as registered_by
FROM colleges c
JOIN users u ON c.user_id = u.id
WHERE u.email = 'college@example.com';
```

### 2️⃣ View All Colleges
```sql
SELECT 
    c.id,
    c.name,
    c.city,
    c.state,
    c.established_year,
    c.accreditation,
    c.referral_code
FROM colleges c
ORDER BY c.name;
```

### 3️⃣ View College with Degrees
```sql
SELECT 
    c.name as college_name,
    d.id as degree_id,
    d.degree_name,
    d.created_at
FROM colleges c
LEFT JOIN degrees d ON c.id = d.college_id
WHERE c.name ILIKE '%MIT%'
ORDER BY d.created_at DESC;
```

### 4️⃣ View College Placements
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
WHERE c.id = 'college_uuid_here'
ORDER BY cp.academic_year DESC;
```

### 5️⃣ View College Rankings
```sql
SELECT 
    c.name as college_name,
    cr.ranking_body,
    cr.rank_value,
    cr.year,
    cr.category,
    cr.certificate_url
FROM college_rankings cr
JOIN colleges c ON cr.college_id = c.id
WHERE c.id = 'college_uuid_here'
ORDER BY cr.year DESC;
```

### 6️⃣ College Summary (Degrees, Placements, Rankings)
```sql
SELECT 
    c.id,
    c.name,
    c.city,
    COUNT(DISTINCT d.id) as degree_count,
    COUNT(DISTINCT cp.id) as placement_records,
    COUNT(DISTINCT cr.id) as ranking_records
FROM colleges c
LEFT JOIN degrees d ON c.id = d.college_id
LEFT JOIN college_placements cp ON c.id = cp.college_id
LEFT JOIN college_rankings cr ON c.id = cr.college_id
GROUP BY c.id, c.name, c.city
ORDER BY c.name;
```

### 7️⃣ Generate Referral Code (Check if taken)
```sql
SELECT 
    c.id,
    c.name,
    c.referral_code
FROM colleges c
WHERE c.referral_code = '123456'
LIMIT 1;
```

---

## 🏢 Company Profile Queries

### 1️⃣ View All Companies
```sql
SELECT 
    c.id,
    c.name,
    c.industry,
    c.company_type,
    c.founded_year,
    c.headquarters,
    c.state,
    c.city,
    c.website_url,
    c.logo_url
FROM companies c
ORDER BY c.name;
```

### 2️⃣ View Company Details
```sql
SELECT 
    c.id,
    c.name,
    c.description,
    c.industry,
    c.company_type,
    c.founded_year,
    c.state,
    c.city,
    c.address,
    c.hr_email,
    c.phone,
    c.logo_url,
    u.email as registered_by
FROM companies c
JOIN users u ON c.user_id = u.id
WHERE c.id = 'company_uuid_here';
```

### 3️⃣ View Company Locations
```sql
SELECT 
    c.name as company_name,
    cl.city,
    cl.state,
    cl.address
FROM company_locations cl
JOIN companies c ON cl.company_id = c.id
WHERE c.id = 'company_uuid_here'
ORDER BY cl.state, cl.city;
```

### 4️⃣ View Company Tech Stack
```sql
SELECT 
    c.name as company_name,
    STRING_AGG(cts.technology, ', ' ORDER BY cts.technology) as technologies
FROM company_tech_stack cts
JOIN companies c ON cts.company_id = c.id
WHERE c.id = 'company_uuid_here'
GROUP BY c.name;
```

### 5️⃣ View Company Roles
```sql
SELECT 
    c.name as company_name,
    cr.role_name,
    cr.experience_level,
    cr.salary_range
FROM company_roles cr
JOIN companies c ON cr.company_id = c.id
WHERE c.id = 'company_uuid_here'
ORDER BY cr.role_name;
```

### 6️⃣ Company Full Summary
```sql
SELECT 
    c.id,
    c.name,
    c.industry,
    c.company_type,
    COUNT(DISTINCT cl.id) as location_count,
    COUNT(DISTINCT cts.id) as tech_count,
    COUNT(DISTINCT cr.id) as role_count
FROM companies c
LEFT JOIN company_locations cl ON c.id = cl.company_id
LEFT JOIN company_tech_stack cts ON c.id = cts.company_id
LEFT JOIN company_roles cr ON c.id = cr.company_id
WHERE c.id = 'company_uuid_here'
GROUP BY c.id, c.name, c.industry, c.company_type;
```

---

## 🎓 General Analytics Queries

### 1️⃣ Most Common Skills
```sql
SELECT 
    s.skill_name,
    COUNT(us.user_id) as user_count
FROM skills s
LEFT JOIN user_skills us ON s.id = us.skill_id
GROUP BY s.id, s.skill_name
ORDER BY user_count DESC
LIMIT 20;
```

### 2️⃣ Students by State
```sql
SELECT 
    p.state,
    COUNT(DISTINCT u.id) as student_count
FROM users u
JOIN profiles p ON u.id = p.user_id
WHERE u.user_type = 3  -- student_professional
GROUP BY p.state
ORDER BY student_count DESC;
```

### 3️⃣ Colleges by State
```sql
SELECT 
    state,
    COUNT(id) as college_count
FROM colleges
GROUP BY state
ORDER BY college_count DESC;
```

### 4️⃣ Database Size Summary
```sql
SELECT 
    COUNT(DISTINCT CASE WHEN user_type = 3 THEN id END) as students,
    COUNT(DISTINCT CASE WHEN user_type = 4 THEN id END) as colleges,
    COUNT(DISTINCT CASE WHEN user_type = 7 THEN id END) as companies,
    COUNT(DISTINCT id) as total_users
FROM users;
```

### 5️⃣ Top 10 Most Educated Students
```sql
SELECT 
    u.name,
    u.email,
    COUNT(e.id) as education_count
FROM users u
LEFT JOIN education e ON u.id = e.user_id
WHERE u.user_type = 3
GROUP BY u.id, u.name, u.email
ORDER BY education_count DESC
LIMIT 10;
```

### 6️⃣ Most Experienced Users
```sql
SELECT 
    u.name,
    u.email,
    COUNT(ex.id) as experience_count,
    MIN(ex.start_date) as earliest_start
FROM users u
LEFT JOIN experience ex ON u.id = ex.user_id
WHERE u.user_type = 3
GROUP BY u.id, u.name, u.email
HAVING COUNT(ex.id) > 0
ORDER BY experience_count DESC
LIMIT 10;
```

---

## 🛠️ Maintenance Queries

### 1️⃣ Check for Duplicate Skills
```sql
SELECT 
    LOWER(skill_name) as skill_lower,
    COUNT(*) as count
FROM skills
GROUP BY LOWER(skill_name)
HAVING COUNT(*) > 1
ORDER BY count DESC;
```

### 2️⃣ Find Orphaned User Skills (Cleanup)
```sql
SELECT 
    us.user_id,
    us.skill_id
FROM user_skills us
WHERE us.user_id NOT IN (SELECT id FROM users)
   OR us.skill_id NOT IN (SELECT id FROM skills);
```

### 3️⃣ Check Referral Code Distribution
```sql
SELECT 
    referral_code,
    COUNT(*) as count
FROM colleges
WHERE referral_code IS NOT NULL
GROUP BY referral_code
HAVING COUNT(*) > 1;
```

### 4️⃣ Database Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 5️⃣ Check All Indexes
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

## ⚠️ Important Notes

- **UUID Format**: All IDs are now UUIDs (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- **Replace placeholders**: Use actual UUIDs or emails instead of `'user@example.com'` or `'college_uuid_here'`
- **User Types**: 3=Student, 4=College, 5=University, 6=School, 7=Company
- **Referral Codes**: 6-digit unique codes for colleges
- **Cascading Deletes**: Deleting a user deletes all related profiles, education, experience, etc.
- **All IDs use UUIDs**: profiles, education, experience, skills, certifications, colleges, degrees, companies, etc.
