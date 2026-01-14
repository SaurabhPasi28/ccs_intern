import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function Dashboard() {
  const navigate = useNavigate();
  const userType = Number(localStorage.getItem("user_type"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goToProfile = () => {
    if (userType === 3) navigate("/profile/student");
    else if (userType === 6) navigate("/profile/school");
    else if (userType === 4) navigate("/profile/college");
    else if (userType === 5) navigate("/profile/university");
    else if (userType === 7) navigate("/profile/company");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center space-y-6">

      {/* STUDENT */}
      {userType === 3 && (
        <>
          <h1 className="text-3xl font-bold">🎓 Student Dashboard</h1>
          <p className="text-gray-600">
            Welcome! View your learning progress and activities.
          </p>
        </>
      )}

      {/* SCHOOL */}
      {userType === 6 && (
        <>
          <h1 className="text-3xl font-bold">🏫 School Dashboard</h1>
          <p className="text-gray-600">
            Manage school operations and students.
          </p>
        </>
      )}

      {/* COLLEGE */}
      {userType === 4 && (
        <>
          <h1 className="text-3xl font-bold">🎓 College Dashboard</h1>
          <p className="text-gray-600">
            Handle college departments and admissions.
          </p>
        </>
      )}

      {/* UNIVERSITY */}
      {userType === 5 && (
        <>
          <h1 className="text-3xl font-bold">🏛️ University Dashboard</h1>
          <p className="text-gray-600">
            University administration and analytics.
          </p>
        </>
      )}

      {/* COMPANY */}
      {userType === 7 && (
        <>
          <h1 className="text-3xl font-bold">🏢 Company Dashboard</h1>
          <p className="text-gray-600">
            Manage jobs and recruitment process.
          </p>
        </>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <Button onClick={goToProfile}>
          Profile
        </Button>

        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

