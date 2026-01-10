import { useState } from "react";
import { User, Mail, Lock, UserCircle, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.post(
        `${baseUrl}/api/auth/signup`,
        { name, email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Signup successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-600 text-white rounded-xl p-3">
              <UserCircle size={22} />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-800">PCMS</h1>
          <p className="text-sm text-gray-500">
            Profession Connection Management System
          </p>
        </div>

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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
          <div className="mb-5">
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-2">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setRole("user")}
                className={`border rounded-xl p-4 text-center cursor-pointer transition
                  ${
                    role === "user"
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-blue-400"
                  }`}
              >
                <User className="mx-auto mb-2" size={22} />
                <p className="text-sm font-medium">User</p>
              </div>

              <div
                onClick={() => setRole("professional")}
                className={`border rounded-xl p-4 text-center cursor-pointer transition
                  ${
                    role === "professional"
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-blue-400"
                  }`}
              >
                <Briefcase className="mx-auto mb-2" size={22} />
                <p className="text-sm font-medium">Professional</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
