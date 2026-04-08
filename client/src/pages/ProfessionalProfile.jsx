import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  ArrowLeft,
  Star,
  Globe,
  DollarSign,
  Loader
} from "lucide-react";

export default function ProfessionalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [connectionStatus, setConnectionStatus] = useState("none");
  const [sendingRequest, setSendingRequest] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const profileRes = await axios.get(
          `http://localhost:5000/api/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfessional(profileRes.data);

        const connRes = await axios.get(
          "http://localhost:5000/api/connections/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        let status = "none";

        connRes.data.forEach((conn) => {
          if (
            (conn.sender._id === currentUser.id &&
              conn.receiver._id === id) ||
            (conn.sender._id === id &&
              conn.receiver._id === currentUser.id)
          ) {
            status = conn.status;
          }
        });

        setConnectionStatus(status);
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 404) {
          setError("Professional not found.");
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate, currentUser?.id]);

  const handleConnect = async () => {
    try {
      setSendingRequest(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/connections/send/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConnectionStatus("pending");
    } catch (err) {
      console.error("Connection error:", err);
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} /> Back
          </button>

          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-10">
      <div className="max-w-5xl mx-auto px-4">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-24"></div>

          <div className="px-8 pb-10">

            {/* PROFILE TOP */}
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-14 mb-8">

              <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl text-blue-600 font-bold border">
                {professional.name?.charAt(0)}
              </div>

              <div className="md:ml-6 mt-4 flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900">{professional.name}</h2>

                <div className="flex gap-3 mt-3 flex-wrap justify-center md:justify-start">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {professional.professionalType}
                  </span>

                  <span className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star size={16} fill="currentColor" />
                    {professional.numReviews > 0
                      ? professional.rating.toFixed(1)
                      : "No ratings"}
                  </span>
                </div>
              </div>

              {!isOwnProfile && (
                <button
                  onClick={handleConnect}
                  disabled={connectionStatus !== "none" || sendingRequest}
                  className={`mt-4 md:mt-0 px-6 py-3 rounded-xl text-white font-medium transition shadow-lg hover:shadow-xl
                    ${connectionStatus === "accepted" && "bg-green-500"}
                    ${connectionStatus === "pending" && "bg-yellow-500"}
                    ${connectionStatus === "none" && "bg-blue-600 hover:bg-blue-700"}
                    ${sendingRequest && "opacity-70"}
                  `}
                >
                  {sendingRequest && "Sending..."}
                  {!sendingRequest && connectionStatus === "none" && "Connect"}
                  {!sendingRequest && connectionStatus === "pending" && "Pending"}
                  {!sendingRequest && connectionStatus === "accepted" && "Connected"}
                </button>
              )}
            </div>

            {/* DETAILS */}
            <div className="grid md:grid-cols-2 gap-8">

              <div className="bg-gray-50 p-5 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-800">Contact</h3>
                <p className="flex gap-2 text-gray-600"><Mail size={16} /> {professional.email}</p>
                {professional.phone && <p className="flex gap-2 text-gray-600"><Phone size={16} /> {professional.phone}</p>}
                {professional.address && <p className="flex gap-2 text-gray-600"><MapPin size={16} /> {professional.address}</p>}
              </div>

              <div className="bg-gray-50 p-5 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-800">Professional</h3>
                {professional.experience > 0 && <p className="flex gap-2 text-gray-600"><Briefcase size={16} /> {professional.experience} yrs</p>}
                {professional.qualification && <p className="flex gap-2 text-gray-600"><Award size={16} /> {professional.qualification}</p>}
                {professional.expertise && <p className="flex gap-2 text-gray-600"><Globe size={16} /> {professional.expertise}</p>}
                {professional.hourlyRate > 0 && <p className="flex gap-2 text-gray-600"><DollarSign size={16} /> ${professional.hourlyRate}/hr</p>}
              </div>

            </div>

            {/* SKILLS */}
            {professional.skills && professional.skills.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-3 text-gray-800">Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {(Array.isArray(professional.skills)
                    ? professional.skills
                    : professional.skills.split(",")
                  ).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm shadow-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* BIO */}
            {professional.bio && (
              <div className="mt-8">
                <h3 className="font-semibold mb-2 text-gray-800">About</h3>
                <p className="text-gray-600 leading-relaxed">{professional.bio}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}