# CCS Platform - Complete Project Overview

## 🎯 What is this Project?

**CCS (College-Company-Student) Platform** is a comprehensive web application that connects:
- **Students/Professionals** - who want to showcase their profiles
- **Educational Institutions** (Schools, Colleges, Universities)
- **Companies** - for recruitment and hiring

It's like a LinkedIn + University Portal combined system where different user types can register, manage profiles, and interact.

---

## 🏗️ Architecture Overview

### **Tech Stack:**
- **Frontend**: React + Vite + TailwindCSS + Shadcn UI
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer (for verification emails)
- **File Upload**: Multer + Sharp (image processing)

---

## 📂 Project Structure

```
CCS/
├── backend/           # Node.js API Server
│   ├── controllers/   # Business logic
│   ├── routes/        # API endpoints
│   ├── middleware/    # Auth protection
│   ├── utils/         # Helper functions (email)
│   ├── uploads/       # Uploaded images storage
│   ├── db.js          # PostgreSQL connection
│   ├── index.js       # Server entry point
│   └── schema.sql     # Database schema
│
└── frontend/          # React Application
    └── src/
        ├── components/    # UI Components
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── student/
        │   ├── college/
        │   ├── company/
        │   └── ui/        # Reusable UI components
        └── App.jsx        # Main router
```

---

## 🗄️ Database Schema Explanation

### **PostgreSQL Tables:**

#### 1️⃣ **user_types** (Lookup table)
```sql
id | name
---|--------------------
1  | admin
2  | subadmin
3  | student_professional
4  | college
5  | university
6  | school
7  | company
```

#### 2️⃣ **users** (Main authentication table)
- Stores: email, password (hashed), user type
- UUID primary key (not auto-increment numbers)
- Handles email verification, password reset tokens
- Links to specific profile tables

#### 3️⃣ **profiles** (Student/Professional profiles)
- One-to-one with users
- Stores: bio, location, profile/banner images

#### 4️⃣ **education** (Student education history)
- One-to-many with users
- Degree, institution, years

#### 5️⃣ **experience** (Work experience)
- One-to-many with users
- Job title, company, duration

#### 6️⃣ **skills** + **user_skills** (Many-to-many)
- Skills database with user associations

#### 7️⃣ **certifications**
- Certificates earned by users

#### 8️⃣ **colleges** (College profiles)
- One-to-one with users (where user_type = 4)
- Name, logo, location, contact info

#### 9️⃣ **college_programs** (Courses offered)
- Programs/degrees offered by colleges
- Fees, duration, seats

#### 🔟 **college_facilities**, **college_placements**, **college_rankings**
- Additional college information

#### 1️⃣1️⃣ **companies** (Company profiles)
- One-to-one with users (where user_type = 7)
- Industry, founding year, description

#### 1️⃣2️⃣ **company_locations**, **company_tech_stack**, **company_roles**
- Company additional information

---

## 🔐 Authentication Flow

### **Registration:**
1. User fills form → `/api/auth/register`
2. Backend validates, hashes password
3. Generates verification token
4. Stores in `users` table (is_verified = FALSE)
5. Sends email with verification link
6. User clicks link → `/api/auth/verify/:token`
7. Account activated

### **Login:**
1. User enters email/password → `/api/auth/login`
2. Backend checks credentials
3. If verified → generates JWT token
4. Token stored in cookie + returned to client
5. Frontend stores token in localStorage
6. All protected routes require this token

### **Password Reset:**
1. User requests reset → `/api/auth/forgot-password`
2. Backend generates reset token (expires in 15 min)
3. Email sent with reset link
4. User clicks link, enters new password → `/api/auth/reset-password/:token`
5. Password updated

---

## 🔑 Key Backend Files Explained

### **db.js** (Database Connection)
```javascript
const { Pool } = require("pg");
const pool = new Pool({
    host: 'localhost',      // PostgreSQL server location
    user: 'postgres',       // DB username
    password: 'root',       // DB password
    database: 'CCS',        // Database name
    port: 5432              // Default PostgreSQL port
});
```
- Uses `pg` library (PostgreSQL client)
- Creates connection pool for efficient DB queries
- All controllers import this to run SQL queries

### **index.js** (Server Entry Point)
- Sets up Express server
- Configures CORS (allows frontend to call backend)
- Mounts routes:
  - `/api/auth/*` → Authentication
  - `/api/profile/*` → User profiles
  - `/api/college/*` → College data
  - `/api/company/*` → Company data
- Serves uploaded files from `/uploads`

### **authController.js**
- `registerUser` - Creates new user
- `loginUser` - Authenticates user
- `verifyEmail` - Activates account
- `forgotPassword` - Initiates password reset
- `resetPassword` - Changes password

### **profileController.js**
- `getProfile` - Fetches user profile data
- `updateProfile` - Updates bio, location
- `uploadProfileImage` - Handles profile picture
- Education, experience, skills, certifications CRUD

---

## 🎨 Frontend Structure

### **App.jsx** (Main Router)
- Uses React Router
- **Public Routes:** Register, Login, Forgot Password
- **Protected Routes:** Dashboard, Profiles (require token)
- Route Guards:
  - `PrivateRoute` - Redirects to login if no token
  - `PublicRoute` - Redirects to dashboard if logged in

### **Component Flow:**
1. User lands on Register
2. After registration → Login
3. After login → Dashboard
4. From Dashboard → Navigate to profile (based on user_type)

### **User Types & Routes:**
- Student/Professional → `/profile/student`
- School → `/profile/school`
- College → `/profile/college`
- University → `/profile/university`
- Company → `/profile/company`

---

## 📧 Email Configuration

Uses **Gmail SMTP** via Nodemailer:
```javascript
EMAIL_USER=cccs1422@gmail.com
EMAIL_PASS=ugcu obzk wbpt lcxy  // App-specific password
```

Sends two types of emails:
1. **Verification Email** - After registration
2. **Reset Password Email** - For password recovery

---

## 🖼️ File Upload System

- **Storage:** `backend/uploads/`
- **Subfolders:**
  - `profiles/` - User profile images
  - `banners/` - Banner images
  - `college/logos/` - College logos
  - `company/` - Company images

- **Processing:**
  - Uses Multer for upload
  - Sharp for image optimization (resize, compress)
  - Maximum size: 2MB

---

## 🚀 API Endpoints Summary

### **Auth Routes:**
```
POST   /api/auth/register              - Create account
POST   /api/auth/login                 - Login
GET    /api/auth/verify/:token         - Verify email
POST   /api/auth/logout                - Logout
POST   /api/auth/forgot-password       - Request reset
POST   /api/auth/reset-password/:token - Reset password
POST   /api/auth/resend-verification   - Resend verification email
POST   /api/auth/check-user            - Check if user verified
```

### **Profile Routes:**
```
GET    /api/profile                    - Get user profile
PUT    /api/profile                    - Update profile
POST   /api/profile/profile-image      - Upload profile pic
POST   /api/profile/banner-image       - Upload banner
POST   /api/profile/education          - Add education
PUT    /api/profile/education/:id      - Update education
DELETE /api/profile/education/:id      - Delete education
... (similar for experience, skills, certifications)
```

### **College Routes:**
```
GET    /api/college/profile            - Get college profile
POST   /api/college/profile            - Create/Update college
POST   /api/college/programs           - Add program
POST   /api/college/facilities         - Add facility
POST   /api/college/placements         - Add placement data
... (similar operations)
```

### **Company Routes:**
```
Similar structure to college routes
```

---

## 🔒 Security Features

1. **Password Hashing:** Bcrypt (10 salt rounds)
2. **JWT Tokens:** Signed with secret, 1-day expiry
3. **HTTP-Only Cookies:** Prevents XSS attacks
4. **Email Verification:** Prevents fake registrations
5. **Token Expiry:** Reset tokens expire in 15 minutes
6. **SQL Injection Protection:** Parameterized queries ($1, $2, etc.)

---

## 📦 Dependencies

### **Backend:**
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT generation
- `nodemailer` - Email sending
- `multer` - File uploads
- `sharp` - Image processing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `cookie-parser` - Cookie handling

### **Frontend:**
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP requests
- `tailwindcss` - Styling
- `@shadcn/ui` - UI components
- `jwt-decode` - Decode JWT tokens
- `lucide-react` - Icons

---

## 🎯 User Journeys

### **Student Journey:**
1. Register → Verify email → Login
2. Dashboard → Navigate to Student Profile
3. Fill profile: bio, location, profile pic
4. Add education, experience, skills, certifications
5. Profile visible to companies/colleges

### **College Journey:**
1. Register → Verify email → Login
2. Dashboard → Navigate to College Profile
3. Fill college details: name, logo, location
4. Add programs, facilities, placement records
5. Showcase rankings and accreditations

### **Company Journey:**
1. Register → Verify email → Login
2. Dashboard → Navigate to Company Profile
3. Fill company details: industry, description
4. Add office locations, tech stack, open roles
5. Connect with students/colleges

---

## 🧩 How Everything Connects

1. **User registers** → Entry in `users` table
2. **Based on user_type:**
   - Student (3) → Can create entry in `profiles`, `education`, `experience`
   - College (4) → Can create entry in `colleges`, `college_programs`
   - Company (7) → Can create entry in `companies`, `company_roles`
3. **All profiles linked via UUID** (`user_id` foreign key)
4. **Authentication via JWT** → Middleware checks token on protected routes
5. **File uploads** → Stored locally, URLs saved in database

---

## 💡 Key Concepts for PostgreSQL Beginners

### **What is PostgreSQL?**
- Open-source relational database (like MySQL)
- Uses SQL (Structured Query Language)
- Stores data in tables with rows and columns
- Supports complex relationships between tables

### **Primary Key:**
```sql
id UUID PRIMARY KEY
```
- Unique identifier for each row
- UUID = Universally Unique Identifier (like: `123e4567-e89b-12d3-a456-426614174000`)

### **Foreign Key:**
```sql
user_id UUID REFERENCES users(id)
```
- Links to another table
- Creates relationship between tables
- `ON DELETE CASCADE` = Delete related records automatically

### **Indexes:**
```sql
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
```
- Speeds up queries on that column
- Like a book index for fast lookups

### **Connection Pool:**
- Reuses database connections
- More efficient than creating new connection each time
- Handles multiple requests simultaneously

---

## 🎓 Next Steps: You'll Learn

As you work on this project, you'll understand:
- ✅ RESTful API design
- ✅ Database relationships (one-to-one, one-to-many, many-to-many)
- ✅ JWT authentication
- ✅ File upload handling
- ✅ Email integration
- ✅ Frontend-backend integration
- ✅ PostgreSQL queries and transactions
- ✅ Middleware and route protection
- ✅ Error handling and validation

---

**This project is a great learning opportunity! Don't worry about not knowing PostgreSQL - you'll pick it up quickly by working with it.** 🚀
