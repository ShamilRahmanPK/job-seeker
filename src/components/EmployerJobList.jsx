import React, { useEffect, useState } from "react";
import { getAllJobsAPI, deleteJobAPI, updateJobAPI } from "../services/allAPI";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmployerJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    company: "",
    requirements: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await getAllJobsAPI();
      if (res?.data) {
        const myJobs = res.data.filter(job => job?.employer?._id === user?.id);
        setJobs(myJobs);
      }
    } catch (error) {
      toast.error("Failed to fetch jobs");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteJobAPI(id, token);
      if (res?.status === 200) {
        toast.success("Job deleted");
        fetchJobs();
      } else {
        toast.error("Failed to delete job");
      }
    } catch {
      toast.error("Error deleting job");
    }
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || "",
      company: job.company || "",
      requirements: job.requirements || "",
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await updateJobAPI(selectedJob._id, formData, token);
      if (res?.status === 200) {
        toast.success("Job updated!");
        setSelectedJob(null);
        fetchJobs();
      } else {
        toast.error("Failed to update job");
      }
    } catch {
      toast.error("Error updating job");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user?.id]);

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Your Job Posts</h2>
        <Link
          to="/post-job"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Post Job
        </Link>
      </div>

      {jobs.length > 0 ? (
        <>
          <div className="overflow-x-auto shadow-md rounded">
            <table className="min-w-full bg-white text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left hidden sm:table-cell">Location</th>
                  <th className="px-4 py-2 text-left">Salary</th>
                  <th className="px-4 py-2 text-left hidden sm:table-cell">Applications</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentJobs.map((job) => (
                  <tr key={job._id} className="border-b">
                    <td className="px-4 py-3">{job.title}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{job.location}</td>
                    <td className="px-4 py-3">₹{job.salary}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{job.applications?.length || 0}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => handleEditClick(job)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">No job posts yet.</p>
      )}

      {/* Edit Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Job</h2>
            <div className="grid gap-3">
              {["title", "company", "location", "salary"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full px-3 py-2 border rounded"
                />
              ))}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Job Description"
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Requirements"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  toast.info("Edit cancelled");
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerJobList;
