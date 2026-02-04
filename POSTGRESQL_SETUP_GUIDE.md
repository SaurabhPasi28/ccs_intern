# 🐘 PostgreSQL Setup Guide for CCS Project

## Step 1: Verify pgAdmin Installation

You mentioned you already downloaded pgAdmin. Let's verify:

1. Open **pgAdmin 4** from Start Menu
2. You'll see a browser-based interface
3. Default server will be **PostgreSQL 17** (or whatever version you installed)

---

## Step 2: Set Master Password (First Time Only)

When you open pgAdmin for the first time:
1. It will ask for a **Master Password**
2. This is to protect your pgAdmin interface (not the database password)
3. Set it and remember it (you'll need it each time you open pgAdmin)

---

## Step 3: Connect to PostgreSQL Server

### A. Find Your Server
1. In pgAdmin, look at left sidebar
2. Expand **Servers** → **PostgreSQL 17** (or your version)
3. It will ask for the **PostgreSQL password**

### B. What's the PostgreSQL Password?
- During PostgreSQL installation, you set a password for the **postgres** user
- If you don't remember, you might need to reset it
- Your `.env` file says password is `root`

### C. Connect
1. Enter password (likely `root` based on your .env)
2. If it connects ✅ → You're ready!
3. If it fails ❌ → See troubleshooting below

---

## Step 4: Create the CCS Database

### Option 1: Using pgAdmin (GUI Method) ✨

1. **Right-click on "Databases"** (under PostgreSQL server)
2. Click **Create** → **Database...**
3. Fill in:
   - **Database name:** `CCS`
   - **Owner:** `postgres` (default)
4. Click **Save**

### Option 2: Using SQL Query

1. Click on **PostgreSQL 17** server
2. Go to **Tools** → **Query Tool** (or press Alt+Shift+Q)
3. Paste this command:
   ```sql
   CREATE DATABASE "CCS";
   ```
4. Click **Execute** (▶️ button or F5)

---

## Step 5: Run the Schema File

Now we'll create all the tables using your `schema.sql` file.

### Method 1: Using pgAdmin Query Tool (RECOMMENDED) ✨

1. **Click on the CCS database** you just created
2. Go to **Tools** → **Query Tool**
3. Open your schema file:
   - Click **Open File** (folder icon)
   - Navigate to: `E:\Unpaid\CCS\CCS\backend\schema.sql`
   - Or copy-paste the entire schema.sql content
4. Click **Execute** (▶️ button)
5. You should see: `Query returned successfully`

### Method 2: Using psql Command Line

Open PowerShell and run:
```powershell
psql -U postgres -d CCS -f "E:\Unpaid\CCS\CCS\backend\schema.sql"
```

---

## Step 6: Verify Tables Were Created

1. In pgAdmin, **right-click on CCS database**
2. Click **Refresh**
3. Expand **CCS** → **Schemas** → **public** → **Tables**
4. You should see all these tables:
   - ✅ users
   - ✅ user_types
   - ✅ profiles
   - ✅ education
   - ✅ experience
   - ✅ skills
   - ✅ user_skills
   - ✅ certifications
   - ✅ colleges
   - ✅ college_programs
   - ✅ college_facilities
   - ✅ college_placements
   - ✅ college_rankings
   - ✅ companies
   - ✅ company_locations
   - ✅ company_tech_stack
   - ✅ company_roles

---

## Step 7: Check Your .env Configuration

Your backend `.env` file should match your PostgreSQL setup:

```env
DB_HOST=localhost          ← PostgreSQL is on your machine
DB_USER=postgres           ← Default PostgreSQL username
DB_PASSWORD=root           ← Your PostgreSQL password
DB_NAME=CCS                ← Database name we just created
DB_PORT=5432               ← Default PostgreSQL port
```

### ⚠️ Important:
- If your PostgreSQL password is **NOT** `root`, update `.env` file
- To find your password, check what you entered during PostgreSQL installation

---

## Step 8: Test Database Connection

Let's verify your backend can connect to PostgreSQL:

1. Open Terminal in VS Code (PowerShell)
2. Navigate to backend folder:
   ```powershell
   cd backend
   ```
3. Create a test file `test-db.js`:
   ```javascript
   require('dotenv').config();
   const pool = require('./db');
   
   pool.query('SELECT NOW()', (err, res) => {
       if (err) {
           console.error('❌ Connection failed:', err.message);
       } else {
           console.log('✅ Connected to PostgreSQL!');
           console.log('Current time from database:', res.rows[0].now);
       }
       pool.end();
   });
   ```
4. Run it:
   ```powershell
   node test-db.js
   ```
5. If successful, you'll see:
   ```
   ✅ Connected to PostgreSQL!
   Current time from database: 2026-01-12T...
   ```

---

## Step 9: Start Your Backend Server

```powershell
cd backend
npm start
```

You should see:
```
Server running on port 5000
```

If you see errors about database connection, check Step 7 again.

---

## 🔍 Understanding Your Database Structure

### How to View Data in pgAdmin:

1. Click on **CCS** database
2. Expand **Schemas** → **public** → **Tables**
3. **Right-click any table** (e.g., `users`)
4. Click **View/Edit Data** → **All Rows**
5. You'll see a spreadsheet-like view

### Example: Viewing Users Table
- Right-click `users` → View/Edit Data → All Rows
- Initially empty (no users yet)
- After registration, users will appear here

---

## 📊 Understanding the Schema

### Key Relationships in Your Database:

```
users (main table)
  ├─ user_types (lookup: student, college, company, etc.)
  │
  ├─ profiles ─────────────┐
  ├─ education            │ (For students/professionals)
  ├─ experience           │
  ├─ certifications       │
  └─ user_skills ─────────┘
  │
  ├─ colleges ─────────────┐
  │   ├─ college_programs  │ (For colleges/universities)
  │   ├─ college_facilities│
  │   ├─ college_placements│
  │   └─ college_rankings ─┘
  │
  └─ companies ────────────┐
      ├─ company_locations │ (For companies)
      ├─ company_tech_stack│
      └─ company_roles ────┘
```

### UUID Explained:
- Your project uses **UUID** (Universally Unique Identifier)
- Example: `550e8400-e29b-41d4-a716-446655440000`
- Better than auto-increment numbers for distributed systems
- Generated automatically by PostgreSQL using `gen_random_uuid()`

---

## 🛠️ Common PostgreSQL Tasks

### 1. View All Databases
```sql
SELECT datname FROM pg_database;
```

### 2. View All Tables in Current Database
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 3. View Table Structure
```sql
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users';
```

### 4. Count Records in a Table
```sql
SELECT COUNT(*) FROM users;
```

### 5. View All User Types
```sql
SELECT * FROM user_types;
```

### 6. Find All Students
```sql
SELECT u.id, u.name, u.email, u.is_verified
FROM users u
WHERE u.user_type = 3;  -- 3 = student_professional
```

### 7. View User with Their Profile
```sql
SELECT u.name, u.email, p.city, p.state, p.bio
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'example@email.com';
```

---

## 🚨 Troubleshooting

### Problem 1: "Could not connect to server"
**Solution:**
1. Make sure PostgreSQL service is running:
   - Open **Services** (Win + R → `services.msc`)
   - Find **postgresql-x64-17** (or your version)
   - Status should be **Running**
   - If not, right-click → **Start**

### Problem 2: "Password authentication failed"
**Solution:**
1. You forgot your PostgreSQL password
2. Need to reset it:
   - Find `pg_hba.conf` file (usually in `C:\Program Files\PostgreSQL\17\data\`)
   - Change `md5` to `trust` for local connections
   - Restart PostgreSQL service
   - Connect without password
   - Run: `ALTER USER postgres PASSWORD 'new_password';`
   - Change `trust` back to `md5` in pg_hba.conf
   - Restart service

### Problem 3: "Port 5432 is already in use"
**Solution:**
- Another PostgreSQL instance is running
- Or port is blocked
- Change port in `.env` and PostgreSQL config

### Problem 4: "Database CCS does not exist"
**Solution:**
- Go back to Step 4 and create the database

### Problem 5: "Table users does not exist"
**Solution:**
- Go back to Step 5 and run schema.sql

### Problem 6: Backend can't connect
**Solution:**
Check these in order:
1. ✅ PostgreSQL service running?
2. ✅ Database "CCS" exists?
3. ✅ Tables created?
4. ✅ .env file has correct credentials?
5. ✅ Port 5432 accessible?

---

## 📚 Learning PostgreSQL Basics

### Key Concepts:

#### 1. **Database vs Schema vs Table**
- **Database:** Container for everything (like "CCS")
- **Schema:** Namespace inside database (default is "public")
- **Table:** Actual data storage (like "users", "colleges")

#### 2. **Data Types**
```sql
VARCHAR(150)    -- Text with max length
TEXT            -- Unlimited text
INTEGER / INT   -- Whole numbers
NUMERIC(12,2)   -- Decimal numbers (12 digits, 2 after decimal)
BOOLEAN         -- true/false
DATE            -- Date only
TIMESTAMP       -- Date + Time
UUID            -- Unique identifier
```

#### 3. **Constraints**
- `PRIMARY KEY` - Unique identifier for each row
- `FOREIGN KEY` - Links to another table
- `UNIQUE` - No duplicates allowed
- `NOT NULL` - Must have a value
- `DEFAULT` - Automatic value if not provided

#### 4. **Relationships**
- **One-to-One:** `users ↔ profiles` (each user has one profile)
- **One-to-Many:** `users → education` (one user has many educations)
- **Many-to-Many:** `users ↔ skills` (via `user_skills` junction table)

#### 5. **Indexes**
- Speed up searches on specific columns
- Like a book index for quick lookups
- Created automatically on primary/foreign keys

---

## 🎓 Next Steps After Setup

1. ✅ **Test Registration Flow:**
   - Start backend: `npm start` (in backend folder)
   - Start frontend: `npm run dev` (in frontend folder)
   - Go to http://localhost:5173
   - Register a new user
   - Check email for verification link
   - Check pgAdmin - you should see user in `users` table!

2. ✅ **Explore Data:**
   - After registering, view users table in pgAdmin
   - See the UUID, hashed password, verification token
   - After verification, `is_verified` becomes `true`

3. ✅ **Test Profile Creation:**
   - Login → Go to profile
   - Fill out profile information
   - Check `profiles` table in pgAdmin
   - See how `user_id` links to `users.id`

4. ✅ **Learn by Querying:**
   - Use pgAdmin Query Tool
   - Try the example queries above
   - Experiment with SELECT, WHERE, JOIN

---

## 🎯 Quick Reference Card

| Task | Command/Location |
|------|------------------|
| Open pgAdmin | Start Menu → pgAdmin 4 |
| Create Database | Right-click Databases → Create |
| Run SQL Query | Tools → Query Tool (Alt+Shift+Q) |
| View Table Data | Right-click table → View/Edit Data |
| Refresh Tables | Right-click database → Refresh |
| Backend Connection | `backend/db.js` |
| DB Config | `backend/.env` |
| Schema File | `backend/schema.sql` |

---

## 💪 You're Ready!

You now have:
- ✅ PostgreSQL installed and running
- ✅ CCS database created
- ✅ All tables created from schema.sql
- ✅ Backend configured to connect
- ✅ Understanding of the database structure

**Let's start building! Ask me anything as you work on the project.** 🚀
