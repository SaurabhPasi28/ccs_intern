-- -- 1️⃣ Create the database (if not exists)
-- -- CREATE DATABASE "CCS";

-- -- 3️⃣ Create the users table with correct structure
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- CREATE TABLE user_types (
--     id INT PRIMARY KEY,
--     name VARCHAR(50) UNIQUE NOT NULL
-- );

-- INSERT INTO user_types (id, name) VALUES
-- (1,'admin'),
-- (2,'subadmin'),
-- (3,'student_professional'),
-- (4,'college'),
-- (5,'university'),
-- (6,'school'),
-- (7,'company');

-- CREATE TABLE users (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     name VARCHAR(150) NOT NULL,
--     email VARCHAR(150) UNIQUE NOT NULL,
--     password TEXT NOT NULL,
--     user_type INT NOT NULL REFERENCES user_types(id),
--     referral_code VARCHAR(50),
--     referred_by_college_id UUID REFERENCES colleges(id),
--     is_verified BOOLEAN DEFAULT FALSE,
--     verification_token TEXT,
--     reset_password_token TEXT,
--     reset_password_expires TIMESTAMP,
--     password_changed_at TIMESTAMP,
--     status BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE profiles (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   state VARCHAR(100),
--   city VARCHAR(100),
--   dob DATE,
--   phone VARCHAR(20),
--   profile_image_url TEXT,
--   banner_image_url TEXT,
--   bio TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE education (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   degree VARCHAR(255) NOT NULL,
--   field_of_study VARCHAR(255),
--   institution VARCHAR(255) NOT NULL,
--   start_year INTEGER,
--   end_year INTEGER,
--   is_current BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE experience (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   title VARCHAR(255) NOT NULL,
--   company VARCHAR(255) NOT NULL,
--   start_date DATE,
--   end_date DATE,
--   is_current BOOLEAN DEFAULT FALSE,
--   description TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE skills (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   skill_name VARCHAR(100) UNIQUE NOT NULL
-- );

-- CREATE TABLE user_skills (
--   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
--   PRIMARY KEY (user_id, skill_id)
-- );

-- CREATE TABLE certifications (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   name VARCHAR(255) NOT NULL,
--   issuing_organization VARCHAR(255) NOT NULL,
--   issue_date DATE,
--   expiry_date DATE,
--   credential_id VARCHAR(255),
--   credential_url TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_profiles_user_id ON profiles(user_id);
-- CREATE INDEX idx_education_user_id ON education(user_id);
-- CREATE INDEX idx_experience_user_id ON experience(user_id);
-- CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
-- CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
-- CREATE INDEX idx_certifications_user_id ON certifications(user_id);

-- CREATE TABLE colleges (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   name VARCHAR(255) NOT NULL,
--   logo_url TEXT,
--   banner_url TEXT,
--   established_year INTEGER,
--   accreditation VARCHAR(255),
--   state VARCHAR(100),
--   city VARCHAR(100),
--   zipcode VARCHAR(20),
--   address TEXT,
--   phone VARCHAR(50),
--   email VARCHAR(255),
--   website_url TEXT,
--   hod_name VARCHAR(255),
--   hod_email VARCHAR(255),
--   hod_phone VARCHAR(50),
--   hod_designation VARCHAR(255),
--   referral_code VARCHAR(10) UNIQUE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE degrees (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
--   degree_name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE college_programs (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
--   degree_level VARCHAR(100),
--   program_name VARCHAR(255) NOT NULL,
--   specialization VARCHAR(255),
--   duration_years INTEGER,
--   annual_fees NUMERIC(12,2),
--   total_seats INTEGER,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE college_facilities (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
--   facility_name VARCHAR(100) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   UNIQUE (college_id, facility_name)
-- );

-- CREATE TABLE college_placements (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
--   academic_year VARCHAR(20),
--   placement_percent NUMERIC(5,2),
--   average_package NUMERIC(12,2),
--   highest_package NUMERIC(12,2),
--   companies_visited INTEGER,
--   top_recruiters TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE college_rankings (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
--   ranking_body VARCHAR(255) NOT NULL,
--   rank_value VARCHAR(100),
--   year INTEGER,
--   category VARCHAR(255),
--   certificate_url TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_colleges_user_id ON colleges(user_id);
-- CREATE INDEX idx_degrees_college_id ON degrees(college_id);
-- CREATE INDEX idx_college_programs_college_id ON college_programs(college_id);
-- CREATE INDEX idx_college_facilities_college_id ON college_facilities(college_id);
-- CREATE INDEX idx_college_placements_college_id ON college_placements(college_id);
-- CREATE INDEX idx_college_rankings_college_id ON college_rankings(college_id);
-- CREATE INDEX idx_users_referred_by_college ON users(referred_by_college_id);

-- CREATE TABLE companies (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,

--     name VARCHAR(255) NOT NULL,
--     industry VARCHAR(150),
--     company_type VARCHAR(100), -- Startup / MNC / SME
--     founded_year INT,

--     description TEXT,

--     headquarters VARCHAR(255),
--     state VARCHAR(100),
--     city VARCHAR(100),
--     address TEXT,
--     zipcode VARCHAR(20),

--     website_url TEXT,
--     linkedin_url TEXT,

--     hr_email VARCHAR(150),
--     phone VARCHAR(50),

--     logo_url TEXT,
--     banner_url TEXT,

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE company_locations (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     company_id UUID REFERENCES companies(id) ON DELETE CASCADE,

--     city VARCHAR(100),
--     state VARCHAR(100),
--     address TEXT
-- );

-- CREATE TABLE company_tech_stack (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     company_id UUID REFERENCES companies(id) ON DELETE CASCADE,

--     technology VARCHAR(100)
-- );

-- CREATE TABLE company_roles (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     company_id UUID REFERENCES companies(id) ON DELETE CASCADE,

--     role_name VARCHAR(150),
--     experience_level VARCHAR(50), -- Fresher / Experienced
--     salary_range VARCHAR(100)
-- );

-- SELECT * FROM companies;

-- Step 1: Drop all existing tables (careful!)


DROP TABLE IF EXISTS college_rankings CASCADE;
DROP TABLE IF EXISTS college_placements CASCADE;
DROP TABLE IF EXISTS degrees CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS company_roles CASCADE;
DROP TABLE IF EXISTS company_tech_stack CASCADE;
DROP TABLE IF EXISTS company_locations CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_types CASCADE;

-- Step 2: Create extensions
 

-- Step 3: User types lookup table
CREATE TABLE user_types (
    id INT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO user_types (id, name) VALUES
(1,'admin'),
(2,'subadmin'),
(3,'student_professional'),
(4,'college'),
(5,'university'),
(6,'school'),
(7,'company');

-- Step 4: Users table (UUID primary key)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type INT NOT NULL REFERENCES user_types(id),
    referral_code VARCHAR(50),
    referred_by_college_id UUID,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    reset_password_token TEXT,
    reset_password_expires TIMESTAMP,
    password_changed_at TIMESTAMP,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Profile table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    state VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    zipcode VARCHAR(20),
    dob DATE,
    phone VARCHAR(20),
    headline TEXT,
    profile_image_url TEXT,
    banner_image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Education table
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    institution VARCHAR(255) NOT NULL,
    start_year INTEGER,
    end_year INTEGER,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 7: Experience table
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 8: Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(100) UNIQUE NOT NULL
);

-- Step 9: User-Skills junction table
CREATE TABLE user_skills (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

-- Step 10: Certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    credential_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 11: Colleges table
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    established_year INTEGER,
    accreditation VARCHAR(255),
    state VARCHAR(100),
    city VARCHAR(100),
    zipcode VARCHAR(20),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website_url TEXT,
    hod_name VARCHAR(255),
    hod_email VARCHAR(255),
    hod_phone VARCHAR(50),
    hod_designation VARCHAR(255),
    referral_code VARCHAR(10) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 12: Degrees table
CREATE TABLE degrees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    degree_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 13: College Placements table
CREATE TABLE college_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    academic_year VARCHAR(20),
    placement_percent NUMERIC(5,2),
    average_package NUMERIC(12,2),
    highest_package NUMERIC(12,2),
    companies_visited INTEGER,
    top_recruiters TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 14: College Rankings table
CREATE TABLE college_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    ranking_body VARCHAR(255) NOT NULL,
    rank_value VARCHAR(100),
    year INTEGER,
    category VARCHAR(255),
    certificate_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Step 15: Companies table
-- CREATE TABLE companies (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
--     name VARCHAR(255) NOT NULL,
--     industry VARCHAR(150),
--     company_type VARCHAR(100),
--     founded_year INT,
--     description TEXT,
--     headquarters VARCHAR(255),
--     state VARCHAR(100),
--     city VARCHAR(100),
--     address TEXT,
--     zipcode VARCHAR(20),
--     website_url TEXT,
--     linkedin_url TEXT,
--     hr_email VARCHAR(150),
--     phone VARCHAR(50),
--     logo_url TEXT,
--     banner_url TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Step 16: Company Locations
-- CREATE TABLE company_locations (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
--     city VARCHAR(100),
--     state VARCHAR(100),
--     address TEXT
-- );

-- -- Step 17: Company Tech Stack
-- CREATE TABLE company_tech_stack (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
--     technology VARCHAR(100)
-- );

-- -- Step 18: Company Roles
-- CREATE TABLE company_roles (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
--     role_name VARCHAR(150),
--     experience_level VARCHAR(50),
--     salary_range VARCHAR(100)
-- );

-- Step 19: Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_experience_user_id ON experience(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_colleges_user_id ON colleges(user_id);
CREATE INDEX idx_degrees_college_id ON degrees(college_id);
CREATE INDEX idx_college_placements_college_id ON college_placements(college_id);
CREATE INDEX idx_college_rankings_college_id ON college_rankings(college_id);
CREATE INDEX idx_users_referred_by_college ON users(referred_by_college_id);
CREATE INDEX idx_colleges_referral_code ON colleges(referral_code);

-- Add foreign key for referred_by_college_id
ALTER TABLE users ADD CONSTRAINT fk_users_referred_by_college 
FOREIGN KEY (referred_by_college_id) REFERENCES colleges(id);

-- old company tables are commented updated company tables later so first drop your tables according to company and create new again like below

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(150),
    company_type VARCHAR(100), -- Startup / MNC / SME
    founded_year INT,
    description TEXT,
    headquarters VARCHAR(255),
    state VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    zipcode VARCHAR(20),
    hr_email VARCHAR(150),
    phone VARCHAR(50),
    logo_url TEXT,
    banner_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE company_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    city VARCHAR(100),
    state VARCHAR(100),
    address TEXT
);

CREATE TABLE company_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    website TEXT,
    linkedin TEXT,
    instagram TEXT,
    facebook TEXT,
    twitter TEXT,
    youtube TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE company_social_links
DROP COLUMN website;

ALTER TABLE companies
ADD COLUMN website TEXT;

ALTER TABLE company_social_links
ADD COLUMN pinterest TEXT;

CREATE TABLE company_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    location_type VARCHAR(50),
    location VARCHAR(255),
    must_reside BOOLEAN,
    timeline VARCHAR(50),
    hiring_count INT,
    pay_show_by VARCHAR(50),
    pay_min NUMERIC,
    pay_max NUMERIC,
    pay_rate VARCHAR(50),
    description TEXT,
    education VARCHAR(150),
    experience_years INT,
    experience_type VARCHAR(150),
    certifications TEXT,
    location_qual TEXT,
    travel VARCHAR(50),
    custom_benefits TEXT,
    status VARCHAR(30) DEFAULT 'draft', -- draft / published / closed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_job_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES company_jobs(id) ON DELETE CASCADE,
    type VARCHAR(100)
);

CREATE TABLE company_job_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES company_jobs(id) ON DELETE CASCADE,
    benefit VARCHAR(100)
);

CREATE TABLE company_job_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES company_jobs(id) ON DELETE CASCADE,
    language VARCHAR(50)
);

CREATE TABLE company_job_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES company_jobs(id) ON DELETE CASCADE,
    shift VARCHAR(50)
);

CREATE TABLE company_job_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES company_jobs(id) ON DELETE CASCADE,
    question TEXT,
    is_required BOOLEAN DEFAULT false
);

CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES company_jobs(id) ON DELETE CASCADE,
    resume_url TEXT,  -- URL/path to uploaded resume
    job_title VARCHAR(255),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'submitted', -- submitted / reviewed / accepted / rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE job_applications
ALTER COLUMN status SET DEFAULT 'pending';

CREATE INDEX idx_job_applications_student_id ON job_applications(student_id);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);



