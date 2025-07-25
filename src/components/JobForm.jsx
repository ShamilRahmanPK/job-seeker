import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJobAPI } from "../services/allAPI";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const JobForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    requirements: "",
    employer: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, company, location, salary, requirements } =
      form;
    if (title && description && company && location) {
      const reqBody = {
        title,
        description,
        company,
        location,
        salary,
        requirements,
        employer: user ? JSON.parse(user).id : "",
      };

      const token = localStorage.getItem("token");
      if (token) {
        const reqHeader = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        try {
          const result = await createJobAPI(reqBody, reqHeader);
          console.log(result);

          if (result?.status === 201) {
              toast.success("Job posted successfully");
              navigate("/employer-dashboard"); 
            } else {
              toast.error("Something went wrong while posting job");
            }
          } catch (err) {
            if (err.response && err.response.status === 406) {
              toast.error(err.response.data);
            } else {
              toast.error("Error while posting job");
              console.error(err);
            }
          }
        }
      } else {
        toast.error("Please fill all required fields");
      }
    };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
            Post a New Job
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-5">
            {[
              { label: "Job Title", name: "title", type: "text" },
              { label: "Company", name: "company", type: "text" },
              { label: "Location", name: "location", type: "text" },
              { label: "Salary (Optional)", name: "salary", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={name !== "salary"}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Requirements (Optional)
              </label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
            >
              Post Job
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JobForm;
