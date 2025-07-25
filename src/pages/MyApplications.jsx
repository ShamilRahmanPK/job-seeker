import React, { useEffect, useState } from "react";
import { getMyApplicationsAPI } from "../services/allAPI";
import { Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getMyApplicationsAPI(token);
        setApplications(res.data.applications);
        console.log("Fetched applications from API:", res.data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        You haven’t applied to any jobs yet.
      </div>
    );
  }

  return (
    <>
    <Navbar/>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            My Applications
          </h2>
          <div className="space-y-4">
            {applications?.map((app) => (
              <div
                key={app._id}
                className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-blue-700">
                      {app.job?.title || "Job Title Not Found"}
                    </h3>
                    <p className="text-sm text-gray-600">{app.job?.company}</p>
                    <p className="text-sm text-gray-500">{app.job?.location}</p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  Cover Letter: {app.coverLetter || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
    </>
   
  );
}

export default MyApplications;
