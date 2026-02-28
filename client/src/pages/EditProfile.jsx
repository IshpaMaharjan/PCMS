import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, X, Loader } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    bio: "",
    skills: "",
    experience: "",
    qualification: "",
    expertise: "Entry Level",
    hourlyRate: "",
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setFetchLoading(true);
        setError("");
        
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        
        console.log("Token exists:", !!token);
        console.log("User string exists:", !!userStr);
        
        if (!token || !userStr) {
          console.log("No token or user found");
          setError("Please login to continue");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const user = JSON.parse(userStr);
        console.log("User from localStorage:", user);
        
        if (!user || !user.id) {
          console.log("Invalid user data");
          setError("Invalid user data. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Fetch the FULL user profile from the server
        await fetchFullUserProfile(user.id, token);
        
      } catch (err) {
        console.error("Error in loadUserProfile:", err);
        setError("Failed to load profile. Please try again.");
        setFetchLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const fetchFullUserProfile = async (userId, token) => {
    try {
      console.log("Fetching full profile for user ID:", userId);
      console.log("API URL:", `http://localhost:5000/api/users/${userId}`);
      
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("API Response status:", response.status);
      console.log("Full profile data received:", response.data);

      const profile = response.data;
      
      // Update form data with the full profile
      setFormData({
        phone: profile.phone || "",
        address: profile.address || "",
        bio: profile.bio || "",
        skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
        experience: profile.experience?.toString() || "",
        qualification: profile.qualification || "",
        expertise: profile.expertise || "Entry Level",
        hourlyRate: profile.hourlyRate?.toString() || "",
      });
      
      console.log("Form data updated with full profile");
      
      // Also update localStorage with any new data from server
      const updatedUser = {
        id: profile._id || profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        professionalType: profile.professionalType,
        ...profile
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
    } catch (err) {
      console.error("=== ERROR FETCHING FULL PROFILE ===");
      console.error("Error:", err);
      
      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        setError("Cannot connect to server. Please make sure the backend is running on port 5000.");
      } else if (err.response) {
        console.error("Error status:", err.response.status);
        console.error("Error data:", err.response.data);
        
        if (err.response.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response.status === 404) {
          setError("User profile not found. Please contact support.");
        } else {
          setError(err.response.data?.message || "Failed to load profile data");
        }
      } else if (err.request) {
        setError("No response from server. Please check if backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
      
      // Re-throw to be caught by the outer catch
      throw err;
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.experience && (isNaN(formData.experience) || parseInt(formData.experience) < 0)) {
      setError("Experience must be a positive number");
      return false;
    }
    if (formData.hourlyRate && (isNaN(formData.hourlyRate) || parseInt(formData.hourlyRate) < 0)) {
      setError("Hourly rate must be a positive number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (!token || !userStr) {
        setError("Authentication failed. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const user = JSON.parse(userStr);

      // Convert comma-separated strings to arrays
      const skillsArray = formData.skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

      const updatedData = {
        phone: formData.phone || "",
        address: formData.address || "",
        bio: formData.bio || "",
        skills: skillsArray,
        experience: formData.experience ? parseInt(formData.experience) : 0,
        qualification: formData.qualification || "",
        expertise: formData.expertise || "Entry Level",
        hourlyRate: formData.hourlyRate ? parseInt(formData.hourlyRate) : 0,
      };

      console.log("Updating profile with:", updatedData);

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("Update response:", response.data);

      // Update local storage user data with the response
      const updatedUser = { 
        ...user, 
        ...response.data,
        // Ensure essential fields are kept
        id: user.id,
        name: response.data.name || user.name,
        email: response.data.email || user.email,
        role: response.data.role || user.role,
        professionalType: response.data.professionalType || user.professionalType,
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      navigate(`/professional/${user.id}`);
    } catch (err) {
      console.error("=== ERROR UPDATING PROFILE ===");
      console.error("Error:", err);
      
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please check if backend is running.");
      } else if (err.response) {
        console.error("Error status:", err.response.status);
        console.error("Error data:", err.response.data);
        
        if (err.response.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError(err.response.data?.message || "Failed to update profile");
        }
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          <span>Back to Profile</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Edit Professional Profile</h1>
            <p className="text-blue-100 mt-1">Update your professional information</p>
          </div>
          
          {error && (
            <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
              {error.includes("backend is running") && (
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +1 234 567 8900"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g., 123 Main St, New York, NY"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="e.g., 5"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g., Bachelor's in Computer Science"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise Level
                  </label>
                  <select
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="e.g., 50"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Skills</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, React, Node.js, Python"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">About Me</h2>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                placeholder="Tell us about yourself, your experience, and what makes you unique..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}