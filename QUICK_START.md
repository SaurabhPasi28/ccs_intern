# 🚀 Quick Start Guide - CCS Project

## Prerequisites Checklist
- ✅ Node.js installed (check: `node --version`)
- ✅ PostgreSQL installed with pgAdmin
- ✅ npm packages installed (you already did `npm i` in both folders)
- ✅ Database "CCS" created in PostgreSQL
- ✅ Schema tables created (run schema.sql)

---

## 🎬 Starting the Application

### Step 1: Start PostgreSQL
1. Open **Services** (Win + R → type `services.msc`)
2. Find **postgresql-x64-17** service
3. Make sure it's **Running**
4. Or open pgAdmin - it will auto-start the service

### Step 2: Start Backend Server
```powershell
# Navigate to backend folder
cd E:\Unpaid\CCS\CCS\backend

# Start the server
npm start
```

**Expected Output:**
```
Server running on port 5000
```

**Keep this terminal open!** The backend needs to stay running.

### Step 3: Start Frontend (New Terminal)
```powershell
# Open NEW terminal (Ctrl + Shift + `)
# Navigate to frontend folder
cd E:\Unpaid\CCS\CCS\frontend

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open Application
1. Open browser
2. Go to: **http://localhost:5173**
3. You should see the Register page! 🎉

---

## 🧪 Testing the Full Flow

### 1️⃣ Register a New User

**URL:** http://localhost:5173/register

**Test Data:**
```
Name: John Doe
Email: john@test.com
Password: Password123
User Type: Student / Professional
Referral Code: (optional, leave empty)
```

**What Happens:**
- Backend creates user in database
- Sends verification email to `john@test.com`
- You'll see success message

**Check in pgAdmin:**
```sql
SELECT id, name, email, is_verified, user_type 
FROM users 
WHERE email = 'john@test.com';
```
You'll see: `is_verified = false`

### 2️⃣ Verify Email

**Problem:** You won't receive real email (unless you have Gmail access)

**Solution:** Get verification token from database

**In pgAdmin Query Tool:**
```sql
SELECT verification_token 
FROM users 
WHERE email = 'john@test.com';
```

Copy the token (long string like: `a1b2c3d4e5f6...`)

**Manual Verification URL:**
```
http://localhost:5173/verify-email/YOUR_TOKEN_HERE
```

Or verify directly via API:
```
http://localhost:5000/api/auth/verify/YOUR_TOKEN_HERE
```

**Check Verification:**
```sql
SELECT is_verified FROM users WHERE email = 'john@test.com';
-- Should now show: true
```

### 3️⃣ Login

**URL:** http://localhost:5173/login

**Credentials:**
```
Email: john@test.com
Password: Password123
```

**What Happens:**
- Backend validates credentials
- Generates JWT token
- Returns user data
- Frontend stores token in localStorage
- Redirects to Dashboard

**Check Token:**
- Open Browser DevTools (F12)
- Go to **Application** tab → **Local Storage** → http://localhost:5173
- You'll see `token` with a long JWT string

### 4️⃣ View Dashboard

**URL:** http://localhost:5173/dashboard

**What You'll See:**
- Welcome message with your name
- User type information
- "Go to Profile" button
- Logout button

### 5️⃣ Create Profile

Click **"Go to Profile"** → Redirects to `/profile/student`

**Fill Out:**
- State, City
- Date of Birth
- Bio
- Upload profile picture (optional)

**Add Education:**
- Degree: B.Tech
- Field: Computer Science
- Institution: XYZ University
- Years: 2020-2024

**Add Experience:**
- Title: Software Intern
- Company: ABC Corp
- Duration: Jan 2023 - Jun 2023
- Description: Worked on React projects

**Add Skills:**
- JavaScript
- React
- Node.js

**Check in pgAdmin:**
```sql
-- View profile
SELECT * FROM profiles WHERE user_id = (
    SELECT id FROM users WHERE email = 'john@test.com'
);

-- View education
SELECT * FROM education WHERE user_id = (
    SELECT id FROM users WHERE email = 'john@test.com'
);

-- View complete profile with joins
SELECT 
    u.name,
    u.email,
    p.city,
    p.state,
    p.bio,
    e.degree,
    e.institution
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN education e ON u.id = e.user_id
WHERE u.email = 'john@test.com';
```

---

## 🏫 Testing College Profile

### Register as College:
```
Name: MIT College
Email: mit@college.com
Password: College123
User Type: College (4)
```

### After Login → College Profile:
**URL:** http://localhost:5173/profile/college

**Fill Out:**
- College Name: MIT College of Engineering
- Logo: Upload image
- Established Year: 1995
- College Type: Private
- Location: City, State
- Contact: phone, email, website

**Add Programs:**
- Degree: B.Tech
- Program: Computer Science
- Duration: 4 years
- Annual Fees: ₹150,000
- Total Seats: 60

**Add Facilities:**
- Library
- Computer Lab
- Sports Complex
- Hostel

---

## 🏢 Testing Company Profile

### Register as Company:
```
Name: Tech Corp
Email: hr@techcorp.com
Password: Company123
User Type: Company (7)
```

### After Login → Company Profile:
**URL:** http://localhost:5173/profile/company

**Fill Out:**
- Company Name: Tech Corp Pvt Ltd
- Industry: Information Technology
- Company Type: Startup
- Founded: 2018
- Description: We build amazing products
- Headquarters: Bangalore
- Website: www.techcorp.com

**Add Tech Stack:**
- React
- Node.js
- MongoDB
- AWS

**Add Office Locations:**
- Bangalore, Karnataka
- Mumbai, Maharashtra

**Add Open Roles:**
- Role: Full Stack Developer
- Experience Level: Fresher
- Salary Range: ₹5-8 LPA

---

## 🔧 Development Workflow

### Making Changes:

#### Backend Changes:
1. Edit file in `backend/` folder
2. **Restart server** (Ctrl+C, then `npm start`)
   - Or use `npm run dev` for auto-restart with nodemon
3. Test in browser/Postman

#### Frontend Changes:
1. Edit file in `frontend/src/`
2. **Vite auto-reloads** - just refresh browser
3. Changes appear immediately

#### Database Changes:
1. Write SQL in pgAdmin Query Tool
2. Execute query
3. No server restart needed
4. If schema changes, update `schema.sql` file

### Debugging Tips:

#### Backend Not Working?
```powershell
# Check if server is running
Get-Process -Name node

# Check if port 5000 is in use
netstat -ano | findstr :5000

# View server logs
# (Look at terminal where you ran npm start)
```

#### Frontend Not Loading?
```powershell
# Check if Vite is running
Get-Process -Name node

# Clear cache and restart
Remove-Item -Recurse -Force node_modules/.vite
npm run dev
```

#### Database Connection Failed?
```powershell
# Test database connection
cd backend
node test-db.js  # (create this file from setup guide)
```

Check `.env` file:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root      # ← Is this correct?
DB_NAME=CCS           # ← Does this database exist?
DB_PORT=5432          # ← Default PostgreSQL port
```

---

## 📡 Testing APIs with PowerShell

### Register User:
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "Test123"
    user_type = 3
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Login:
```powershell
$body = @{
    email = "test@example.com"
    password = "Test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

### Get Profile (with auth):
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/profile" -Method GET -Headers $headers
```

---

## 📊 Monitoring Your Application

### Check Running Processes:
```powershell
# All Node processes
Get-Process -Name node

# Detailed info
Get-Process -Name node | Select-Object Id, ProcessName, StartTime, CPU
```

### View Logs:
- **Backend:** Check terminal where `npm start` is running
- **Frontend:** Check browser console (F12)
- **Database:** Check pgAdmin message panel

### Common Log Messages:

**Backend:**
```
✅ Server running on port 5000
✅ Email sent successfully
❌ Database connection failed
❌ REGISTER ERROR 👉 Email already exists
```

**Frontend Console:**
```
✅ Login successful
✅ Profile updated
❌ Network Error: Failed to fetch
❌ 403 Forbidden: Please verify your email
```

---

## 🛑 Stopping the Application

### Stop Backend:
1. Go to terminal running backend
2. Press **Ctrl + C**
3. Confirm with **Y**

### Stop Frontend:
1. Go to terminal running frontend
2. Press **Ctrl + C**
3. Confirm with **Y**

### Or Kill All Node Processes:
```powershell
# WARNING: Kills ALL Node processes
Stop-Process -Name node -Force
```

---

## 📁 Project Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | localhost:5432 (database) |
| pgAdmin | 5050 | http://localhost:5050 (optional) |

---

## 🎯 Daily Development Routine

### Morning Startup:
```powershell
# 1. Start PostgreSQL (auto-starts with pgAdmin)
# Open pgAdmin

# 2. Start Backend
cd E:\Unpaid\CCS\CCS\backend
npm start

# 3. Start Frontend (new terminal)
cd E:\Unpaid\CCS\CCS\frontend
npm run dev

# 4. Open browser → http://localhost:5173
```

### During Development:
- **Frontend changes:** Auto-reload (just save file)
- **Backend changes:** Restart server (Ctrl+C → npm start)
- **Database changes:** Execute in pgAdmin
- **Test immediately:** Use browser + pgAdmin

### End of Day:
- Commit changes to Git (if using)
- Stop servers (Ctrl+C on both terminals)
- No need to stop PostgreSQL (can run in background)

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Kill node processes or change port in .env |
| Can't connect to database | Check PostgreSQL service is running |
| Email not received | Get verification token from database |
| 401 Unauthorized | Token expired, login again |
| 403 Forbidden | Email not verified |
| CORS error | Check backend cors config (should allow localhost:5173) |
| Module not found | Run `npm install` in that folder |
| Build failed | Delete node_modules and run `npm install` again |

---

## 📞 Getting Help

When asking for help, provide:
1. What you were trying to do
2. What error you got (full error message)
3. Which file you were working on
4. Backend/Frontend logs
5. Screenshot if possible

**Example:**
```
"I'm trying to login but getting 403 error.
Backend logs show: 'Please verify your email'
The user exists in database but is_verified is false.
How do I manually verify the user?"
```

---

## 🎉 You're All Set!

Now you can:
- ✅ Start the full application
- ✅ Test all user flows
- ✅ Add features and modifications
- ✅ Debug issues effectively
- ✅ Work with PostgreSQL confidently

**Happy Coding! 🚀**

Ask me anything as you work through your tasks!
