import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, MapPin, Briefcase, DollarSign, Mail } from "lucide-react";

function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const userRole = user?.role;

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ================= LOAD ================= */
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/vacancies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVacancies(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, [token]);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      return alert("Title and description are required");
    }

    try {
      const res = await axios.post(
        `${baseUrl}/api/vacancies`,
        { title, description, salary, location, contact, experience },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVacancies([res.data, ...vacancies]);
      setTitle("");
      setDescription("");
      setSalary("");
      setLocation("");
      setContact("");
      setExperience("");
    } catch (err) {
      console.error(err);
      alert("Failed to create vacancy");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Slot?")) return;

    try {
      await axios.delete(`${baseUrl}/api/vacancies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVacancies(vacancies.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ===== HEADER ===== */}
        <h1 className="text-3xl font-bold text-center mb-8">Open Slots</h1>

        {/* ===== CREATE (PROFESSIONAL ONLY) ===== */}
        {userRole === "professional" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Post available slots</h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Salary"
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Experience (e.g., 2+ years)"
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact (Email)"
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mt-2"
            >
              Post Vacancy
            </button>
          </div>
        )}

        {/* ===== VACANCY LIST ===== */}
        {vacancies.length === 0 && (
          <p className="text-center text-gray-500">No open slots yet</p>
        )}

        {vacancies.map((v) => {
          // ✅ Safely handle author being object or string
          const authorId = v.author?._id || v.author;
          const isOwner = authorId && String(authorId) === String(userId);
          const canDelete = userRole?.toLowerCase() === "admin" || isOwner;

          return (
            <div
              key={v._id}
              className="bg-white p-6 rounded-2xl shadow-md mb-5 flex justify-between items-start"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="text-gray-700">{v.description}</p>

                <div className="text-sm text-gray-600 space-y-1">
                  {v.salary && (
                    <p className="flex items-center gap-1">
                      <DollarSign size={14} /> {v.salary}
                    </p>
                  )}
                  {v.location && (
                    <p className="flex items-center gap-1">
                      <MapPin size={14} /> {v.location}
                    </p>
                  )}
                  {v.experience && (
                    <p className="flex items-center gap-1">
                      <Briefcase size={14} /> {v.experience}
                    </p>
                  )}
                  {v.contact && (
                    <p className="flex items-center gap-1">
                      <Mail size={14} /> {v.contact}
                    </p>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  {v.author?.name || "Unknown"} ({v.author?.role || "user"})
                </p>
              </div>

              {/* ===== DELETE BUTTON ===== */}
              {canDelete && (
                <button
                  onClick={() => handleDelete(v._id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full transition hover:bg-red-100"
                  title="Delete Slot"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Vacancies;