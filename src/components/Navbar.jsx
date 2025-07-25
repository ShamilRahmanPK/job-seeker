import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Get user details
  const role = user?.role;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md border-b border-gray-200 bg-white relative z-50">
      <div
        className="text-2xl font-bold text-blue-700 tracking-wide cursor-pointer"
        onClick={() => navigate("/")}
      >
        Job<span className="text-blue-500">-Finder</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Show only if role is job-seeker */}
        {role === "job-seeker" && (
          <>
            <button
              onClick={() => navigate("/my-applications")}
              className="text-sm px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            >
              My Applications
            </button>
            <button
              onClick={() => navigate("/saved-jobs")}
              className="text-sm px-4 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition"
            >
              Saved Jobs
            </button>
          </>
        )}

        {token && (
          <button
            onClick={logout}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Logout"
          >
            <LogOut className="h-6 w-6 text-red-500" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
