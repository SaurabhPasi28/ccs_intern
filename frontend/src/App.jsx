// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Register from "./components/Register";
// import Login from "./components/Login";
// import VerifyEmail from "./components/VerifyEmail";
// import ForgotPassword from "./components/ForgotPassword";
// import ResetPassword from "./components/ResetPassword";
// import Dashboard from "./components/Dashboard";

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" replace />;
// }


// function PublicRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? <Navigate to="/dashboard" replace /> : children;
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Redirect root */}
//         <Route path="/" element={<Navigate to="/register" replace />} />

//         {/* Public routes */}
//         <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
//         <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//         <Route path="/verify-email/:token" element={<VerifyEmail />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />

//         {/* Protected route */}
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />

//         {/* Catch-all redirect */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* Auth Pages */
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Welcome from "./components/Welcome";
import UniversityWelcome from "./components/university/UniversityWelcome";
import SchoolWelcome from "./components/school/SchoolWelcome";

/* Dashboard */
import Dashboard from "./components/Dashboard";

/* Profile Pages (already created by you) */
import StudentProfile from "./components/student/StudentProfile";
import SchoolProfile from "./components/school/SchoolProfile";
import CollegeProfile from "./components/college/CollegeProfile";
import CollegePublicProfile from "./components/college/CollegePublicProfile";
import UniversityProfile from "./components/university/UniversityProfile";
import UniversityPublicProfile from "./components/university/UniversityPublicProfile";
import CompanyProfile from "./components/company/CompanyProfile";
import CompanyPublicProfile from "./components/company/CompanyPublicProfile";
import StudentPublicProfile from "./components/student/StudentPublicProfile";
import SchoolPublicProfile from "./components/school/SchoolPublicProfile";
import CompanyPosts from "./components/company/CompanyPosts";
import StudentJobs from "./components/student/Jobs";
import ApplyJob from "./components/student/ApplyJob";
import CompanyJobDetail from "./components/company/CompanyJobDetail";
import PublicJobPage from "./components/publicJobPage";
/* Admin Pages */
import AdminDashboard from "./components/admin/adminDashboard";
import UserListPage from "./components/admin/userTypePage";
/* ---------------- Route Guards ---------------- */

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

/* ---------------- App ---------------- */

function App() {
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Public routes */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Welcome screen - After first login/signup */}
        <Route
          path="/welcome"
          element={
            <PrivateRoute>
              <Welcome />
            </PrivateRoute>
          }
        />

        <Route
          path="/welcome/university"
          element={
            <PrivateRoute>
              <UniversityWelcome />
            </PrivateRoute>
          }
        />

        <Route
          path="/welcome/school"
          element={
            <PrivateRoute>
              <SchoolWelcome />
            </PrivateRoute>
          }
        />

        {/* Public Profile Pages - No Authentication Required */}
        <Route path="/company/:id" element={<CompanyPublicProfile />} />
        <Route path="/college/:id" element={<CollegePublicProfile />} />
        <Route path="/student/:id" element={<StudentPublicProfile />} />
        <Route path="/school/:id" element={<SchoolPublicProfile />} />
        <Route path="/university/:id" element={<UniversityPublicProfile />} />


        {/* Dashboard (single entry after login) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Profile routes (navigated via Profile button) */}
        <Route
          path="/profile/student"
          element={
            <PrivateRoute>
              <StudentProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/school"
          element={
            <PrivateRoute>
              <SchoolProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/college"
          element={
            <PrivateRoute>
              <CollegeProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/university"
          element={
            <PrivateRoute>
              <UniversityProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/company"
          element={
            <PrivateRoute>
              <CompanyProfile />
            </PrivateRoute>
          }
        />
        {/* Company posts (create & manage) */}
        <Route
          path="/company/posts"
          element={
            <PrivateRoute>
              <CompanyPosts />
            </PrivateRoute>
          }
        />
        {/* Student Jobs Page */}
        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              <StudentJobs />
            </PrivateRoute>
          }
        />
        {/* Apply Job Page */}
        <Route
          path="/jobs/apply/:jobId"
          element={
            <PrivateRoute>
              <ApplyJob />
            </PrivateRoute>
          }
        />
        {/* Company Job Detail Page */}
        <Route
          path="/company/posts/:postId"
          element={
            <PrivateRoute>
              <CompanyJobDetail />
            </PrivateRoute>
          }
        />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/userTypePage" element={<UserListPage />} />
        <Route path="/jobs" element={<PublicJobPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
