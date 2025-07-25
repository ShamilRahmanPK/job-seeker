import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllJobsAPI,
  createApplicationAPI,
  saveJobAPI,
} from "../services/allAPI";
import { toast } from "react-toastify";

const JobSeekerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [name, setName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resume, setResume] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false); 

  const fetchJobs = async () => {
    const res = await getAllJobsAPI();
    if (res?.data) setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (name) {
      localStorage.setItem("name", name);
    }
  }, [name]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!resume || !name || !location || !phone) {
    toast.error("Please fill all required fields.");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("job", selectedJob._id);
    formData.append("name", name); 
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume); 
    formData.append("location", location)
    formData.append("phone", phone); 

    const res = await createApplicationAPI(formData, token);

    if (res.status === 201) {
      toast.success("Application submitted successfully!");
      setCoverLetter("");
      setResume(null);
      setModalOpen(false);
    } else {
      toast.error("Failed to submit application");
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
};
  


  const handleSave = async (jobId) => {
    try {
      const res = await saveJobAPI(user.id, jobId, token);
      if (res.status === 200) {
        toast.success("Job saved!");
        setSavedJobs((prev) => [...prev, jobId]);
      }
    } catch (err) {
      toast.error("Failed to save job.");
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      job.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {name || "Job Seeker"}
        </h1>

        {/* Search Section */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by job title"
            className="border p-2 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="border p-2 w-full"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <ul className="space-y-4">
            {filteredJobs.map((job) => (
              <li key={job._id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Salary:</strong> {job.salary}
                </p>
                <p>
                  <strong>Description:</strong> {job.description}
                </p>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => handleSave(job._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs found.</p>
        )}
      </div>

      {/* Application Modal */}
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[90%] md:w-[500px] relative">
            <h2 className="text-xl font-bold mb-4">
              Apply for {selectedJob.title}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full border p-2 mb-3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border p-2 mb-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="url"
                placeholder="LinkedIn Profile (Optional)"
                className="w-full border p-2 mb-3"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              <textarea
                rows="4"
                className="w-full border p-2 mb-3"
                placeholder="Cover Letter (Optional)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <label className="font-semibold">Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full mb-4 border border-gray-300 p-2"
                onChange={(e) => setResume(e.target.files[0])}
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JobSeekerDashboard;
