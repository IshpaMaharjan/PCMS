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
  Clock,
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

  /* ================= FETCH PROFILE + CONNECTION STATUS ================= */
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

        /* ---------- FETCH PROFILE ---------- */
        const profileRes = await axios.get(
          `http://localhost:5000/api/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfessional(profileRes.data);

        /* ---------- FETCH CONNECTION STATUS ---------- */
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
            status = conn.status; // pending / accepted
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

  /* ================= SEND REQUEST ================= */
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

      // Update UI instantly
      setConnectionStatus("pending");

    } catch (err) {
      console.error("Connection error:", err);
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setSendingRequest(false);
    }
  };

  /* ================= LOADING ================= */
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

  /* ================= ERROR ================= */
  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="bg-white p-10 rounded-xl shadow text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-16"></div>

          <div className="px-8 pb-8">

            {/* PROFILE TOP */}
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-10 mb-6">

              <div className="w-28 h-28 bg-white rounded-xl shadow flex items-center justify-center text-3xl text-blue-600 font-bold">
                {professional.name?.charAt(0)}
              </div>

              <div className="md:ml-6 mt-4 flex-1">
                <h2 className="text-2xl font-bold">{professional.name}</h2>

                <div className="flex gap-3 mt-2 flex-wrap">
                  <span className="bg-blue-100 px-3 py-1 rounded">
                    {professional.professionalType}
                  </span>

                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    {professional.rating || 4.5}
                  </span>
                </div>
              </div>

              {/* ================= CONNECT BUTTON ================= */}
              {!isOwnProfile && (
                <button
                  onClick={handleConnect}
                  disabled={connectionStatus !== "none" || sendingRequest}
                  className={`mt-4 md:mt-0 px-6 py-2 rounded-lg text-white font-medium transition
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
            <div className="grid md:grid-cols-2 gap-6 mt-6">

              <div className="space-y-3">
                <h3 className="font-semibold">Contact</h3>

                <p className="flex gap-2"><Mail size={16} /> {professional.email}</p>
                {professional.phone && <p className="flex gap-2"><Phone size={16} /> {professional.phone}</p>}
                {professional.address && <p className="flex gap-2"><MapPin size={16} /> {professional.address}</p>}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Professional</h3>

                {professional.experience > 0 && <p className="flex gap-2"><Briefcase size={16} /> {professional.experience} yrs</p>}
                {professional.qualification && <p className="flex gap-2"><Award size={16} /> {professional.qualification}</p>}
                {professional.expertise && <p className="flex gap-2"><Globe size={16} /> {professional.expertise}</p>}
                {professional.hourlyRate > 0 && <p className="flex gap-2"><DollarSign size={16} /> ${professional.hourlyRate}/hr</p>}
              </div>

            </div>

            {/* BIO */}
            {professional.bio && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600">{professional.bio}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}