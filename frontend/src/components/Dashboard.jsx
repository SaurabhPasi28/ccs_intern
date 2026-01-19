import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">📊 Dashboard</h1>
        <p className="text-gray-600">Choose a profile to manage</p>
      </div>

      {/* Profile Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <Button 
          onClick={() => navigate("/profile/student")}
          className="h-24 text-lg font-semibold"
        >
          🎓 Student Profile
        </Button>

        <Button 
          onClick={() => navigate("/profile/college")}
          className="h-24 text-lg font-semibold"
        >
          🏫 College Profile
        </Button>

        <Button 
          onClick={() => navigate("/profile/school")}
          className="h-24 text-lg font-semibold"
        >
          🏫 School Profile
        </Button>

        <Button 
          onClick={() => navigate("/profile/university")}
          className="h-24 text-lg font-semibold"
        >
          🏛️ University Profile
        </Button>

        <Button 
          onClick={() => navigate("/profile/company")}
          className="h-24 text-lg font-semibold"
        >
          🏢 Company Profile
        </Button>
      </div>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white mt-8"
      >
        Logout
      </Button>
    </div>
  );
}

