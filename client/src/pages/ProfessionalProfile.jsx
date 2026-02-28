import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award, 
  Calendar,
  ArrowLeft,
  Star,
  Globe,
  DollarSign,
  Clock,
  Loader
} from "lucide-react";

export default function ProfessionalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    const fetchProfessionalProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("token");
        
        console.log("=== ProfessionalProfile Debug ===");
        console.log("Profile ID from URL:", id);
        console.log("Token exists:", !!token);
        
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        if (!id) {
          console.log("No ID provided");
          setError("No professional ID provided");
          return;
        }

        console.log("Making API call to:", `http://localhost:5000/api/users/${id}`);
        
        const res = await axios.get(
          `http://localhost:5000/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        console.log("API Response Status:", res.status);
        console.log("Professional data received:", res.data);

        if (!res.data) {
          setError("No data received from server");
          return;
        }

        setProfessional(res.data);
        console.log("Professional state updated");
        
      } catch (err) {
        console.error("=== Error in fetchProfessionalProfile ===");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error code:", err.code);
        
        if (err.code === "ERR_NETWORK") {
          setError("Cannot connect to server. Please make sure backend is running on port 5000.");
        } else if (err.response) {
          console.error("Error status:", err.response.status);
          console.error("Error data:", err.response.data);
          
          if (err.response.status === 401) {
            setError("Session expired. Please login again.");
            setTimeout(() => navigate("/login"), 2000);
          } else if (err.response.status === 404) {
            setError("Professional profile not found.");
          } else {
            setError(err.response.data?.message || "Failed to load professional profile");
          }
        } else if (err.request) {
          console.error("No response received from server");
          setError("No response from server. Please check if backend is running.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalProfile();
  }, [id, navigate]);

  const handleConnect = async () => {
    try {
      setSendingRequest(true);
      const token = localStorage.getItem("token");
      
      await axios.post(
        `http://localhost:5000/api/connections/send/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      alert("Connection request sent successfully!");
    } catch (err) {
      console.error("Error sending request:", err);
      alert(err.response?.data?.message || "Failed to send connection request");
    } finally {
      setSendingRequest(false);
    }
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser?.id === id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
            <span>Back to Professionals</span>
          </button>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-red-600 text-lg mb-4">{error || "Professional not found"}</p>
            <button
              onClick={() => navigate("/services")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          <span>Back to Professionals</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 h-10 relative">
            {isOwnProfile && (
              <button
                onClick={() => navigate("/edit-profile")}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition flex items-center gap-2"
              >
                <span>Edit Profile</span>
              </button>
            )}
          </div>
          
          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar and basic info */}
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-10 mb-8">
              <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-5xl text-blue-600 font-bold">
                  {professional.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{professional.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium">
                    {professional.professionalType || professional.role}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <span className="text-gray-700 font-medium">{professional.rating || "4.5"}</span>
                  </div>
                  {professional.experience > 0 && (
                    <span className="text-gray-600 text-sm flex items-center gap-1">
                      <Clock size={16} />
                      {professional.experience} years exp
                    </span>
                  )}
                </div>
              </div>
              
              {/* Connect button - only show if not own profile */}
              {!isOwnProfile && (
                <button
                  onClick={handleConnect}
                  disabled={sendingRequest}
                  className={`mt-4 md:mt-0 ${
                    sendingRequest ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-8 py-3 rounded-xl transition font-medium shadow-lg flex items-center gap-2`}
                >
                  {sendingRequest ? "Sending..." : "Connect"}
                </button>
              )}
            </div>

            {/* Contact Information & Professional Details */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Contact Information</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={20} className="text-blue-600 flex-shrink-0" />
                    <span className="break-all">{professional.email}</span>
                  </div>
                  
                  {professional.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone size={20} className="text-blue-600 flex-shrink-0" />
                      <span>{professional.phone}</span>
                    </div>
                  )}
                  
                  {(professional.address || professional.city || professional.country) && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={20} className="text-blue-600 flex-shrink-0" />
                      <span>
                        {[
                          professional.address,
                          professional.city,
                          professional.country
                        ].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Languages */}
                {professional.languages?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {professional.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Professional Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Details</h2>
                
                <div className="space-y-3">
                  {professional.experience > 0 && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Briefcase size={20} className="text-blue-600 flex-shrink-0" />
                      <span>{professional.experience} years of experience</span>
                    </div>
                  )}
                  
                  {professional.qualification && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Award size={20} className="text-blue-600 flex-shrink-0" />
                      <span>{professional.qualification}</span>
                    </div>
                  )}
                  
                  {professional.expertise && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Globe size={20} className="text-blue-600 flex-shrink-0" />
                      <span>{professional.expertise}</span>
                    </div>
                  )}
                  
                  {professional.hourlyRate > 0 && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <DollarSign size={20} className="text-blue-600 flex-shrink-0" />
                      <span>${professional.hourlyRate}/hour</span>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {professional.skills?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {professional.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {professional.bio && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{professional.bio}</p>
              </div>
            )}

            {/* Member since */}
            <div className="mt-8 text-sm text-gray-400 border-t pt-4">
              <p>Member since: {new Date(professional.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}