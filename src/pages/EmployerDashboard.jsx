import EmployerJobList from "../components/EmployerJobList";
import Navbar from "../components/Navbar";

const EmployerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your job postings and view applicants below.
          </p>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Posted Jobs
            </h2>

            {/* Jobs Table */}
            <div className="overflow-x-auto">
              <EmployerJobList employerId={user?._id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
