-- 1️⃣ Create the database (if not exists)
-- CREATE DATABASE "CCS";

-- 3️⃣ Create the users table with correct structure
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()


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

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type INT NOT NULL REFERENCES user_types(id),
    referral_code VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    reset_password_token TEXT,
    reset_password_expires TIMESTAMP,
    password_changed_at TIMESTAMP,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  state VARCHAR(100),
  city VARCHAR(100),
  dob DATE,
  profile_image_url TEXT,
  banner_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  institution VARCHAR(255) NOT NULL,
  start_year INTEGER,
  end_year INTEGER,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  skill_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_skills (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE certifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_experience_user_id ON experience(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);

CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  established_year INTEGER,
  college_type VARCHAR(100),
  accreditation VARCHAR(255),
  state VARCHAR(100),
  city VARCHAR(100),
  zipcode VARCHAR(20),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE college_programs (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  degree_level VARCHAR(100),
  program_name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  duration_years INTEGER,
  annual_fees NUMERIC(12,2),
  total_seats INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE college_facilities (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  facility_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (college_id, facility_name)
);

CREATE TABLE college_placements (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  academic_year VARCHAR(20),
  placement_percent NUMERIC(5,2),
  average_package NUMERIC(12,2),
  highest_package NUMERIC(12,2),
  companies_visited INTEGER,
  top_recruiters TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE college_rankings (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  ranking_body VARCHAR(255) NOT NULL,
  rank_value VARCHAR(100),
  year INTEGER,
  category VARCHAR(255),
  certificate_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_colleges_user_id ON colleges(user_id);
CREATE INDEX idx_college_programs_college_id ON college_programs(college_id);
CREATE INDEX idx_college_facilities_college_id ON college_facilities(college_id);
CREATE INDEX idx_college_placements_college_id ON college_placements(college_id);
CREATE INDEX idx_college_rankings_college_id ON college_rankings(college_id);


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

    website_url TEXT,
    linkedin_url TEXT,

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

CREATE TABLE company_tech_stack (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,

    technology VARCHAR(100)
);


CREATE TABLE company_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,

    role_name VARCHAR(150),
    experience_level VARCHAR(50), -- Fresher / Experienced
    salary_range VARCHAR(100)
);

SELECT * FROM companies;

