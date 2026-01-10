import { useState } from "react";
import { Mail, Lock, Eye, User, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // user | professional
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      alert("Email, password and role are required");
      return;
    }

    try {
      setLoading(true);

      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await axios.post(`${baseUrl}/api/auth/login`, {
        email,
        password,
        role,
      });

      // Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 text-white rounded-xl p-3">
              <span className="font-bold text-lg">PCMS</span>
            </div>
          </div>
          <p className="text-gray-600">
            Welcome to Profession Connection Management System
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-2">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setRole("user")}
                className={`border rounded-xl p-4 text-center cursor-pointer transition
                  ${role === "user"
                    ? "border-blue-600 bg-blue-50"
                    : "hover:border-blue-400"}`}
              >
                <User className="mx-auto mb-2" size={22} />
                <p className="text-sm font-medium">User</p>
              </div>

              <div
                onClick={() => setRole("professional")}
                className={`border rounded-xl p-4 text-center cursor-pointer transition
                  ${role === "professional"
                    ? "border-blue-600 bg-blue-50"
                    : "hover:border-blue-400"}`}
              >
                <Briefcase className="mx-auto mb-2" size={22} />
                <p className="text-sm font-medium">Professional</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
