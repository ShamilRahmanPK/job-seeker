import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdPerson, MdPhone } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginAPI, registerAPI } from "../services/allAPI";
import Navbar from "../components/Navbar";

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("job-seeker");
  const [password, setPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    (isLogin || (name.trim() !== "" && phone.trim() !== ""));

  const handlePasswordChange = (e) => {
    const input = e.target.value;
    if (input.length < password.length) {
      setPassword(password.slice(0, -1));
    } else {
      const addedChar = input.slice(-1);
      setPassword(password + addedChar);
    }
    setDisplayPassword("●".repeat(input.length));
  };

  const handleAuth = async () => {
    setError("");
    setLoading(true);

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const result = await loginAPI({ email, password });

        if (result?.status === 200) {
          const { user, token } = result.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Login successful!");
          setTimeout(() => {
            if (user.role === "job_seeker") {
              navigate("/job-seeker-dashboard");
            } else {
              navigate("/employer-dashboard");
            }
          }, 1000);
        } else {
          toast.error("Login failed");
        }
      } else {
        const result = await registerAPI({ name, email, password, role, phone });

        if (result?.status === 201) {
          toast.success("Registration successful! You can now login.");
          setIsLogin(true);
        } else {
          toast.error("Registration failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={2500} />
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-6 py-8">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-l-full font-semibold ${
                isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-r-full font-semibold ${
                !isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 py-2 px-3 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 py-2 px-3 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full py-2 px-3 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="job_seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 py-2 px-3 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={showPassword ? password : displayPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 py-2 px-3 border rounded shadow-sm pr-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-blue-600 font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="button"
              onClick={handleAuth}
              disabled={!isFormValid || loading}
              className={`w-full py-2 px-4 rounded-full font-semibold text-white flex justify-center items-center transition-transform duration-200 ${
                isFormValid && !loading
                  ? "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                  : "bg-blue-400 opacity-50 pointer-events-none"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLogin ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Auth;
