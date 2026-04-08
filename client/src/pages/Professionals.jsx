import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Professionals() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/connections/profession/${role}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setProfessionals(res.data);
      } catch (error) {
        console.error("Error fetching professionals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [role]);

  const handleCardClick = (professionalId) => {
    console.log("Navigating to professional:", professionalId);
    navigate(`/professional/${professionalId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="flex-grow px-6 md:px-10 py-12 max-w-7xl mx-auto w-full">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 capitalize">
            {role} Professionals
          </h2>
          <p className="text-gray-500 text-lg">
            Browse and connect with verified {role} professionals.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500 text-lg animate-pulse">
            Loading professionals...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && professionals.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            No professionals found.
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {professionals.map((pro) => (
            <div
              key={pro._id}
              onClick={() => handleCardClick(pro._id)}
              className="group cursor-pointer bg-white/80 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-3"
            >
              {/* Avatar */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold shadow-inner">
                {pro.name?.charAt(0)}
              </div>

              {/* Info */}
              <h3 className="text-lg font-semibold text-gray-800 text-center group-hover:text-blue-600 transition">
                {pro.name}
              </h3>

              <p className="text-gray-500 text-sm text-center mt-1 capitalize">
                {pro.role}
              </p>

              {/* CTA */}
              <div className="mt-5 text-center text-xs text-gray-400 group-hover:text-blue-500 transition">
                Click to view profile →
              </div>

              {/* Bottom Accent */}
              <div className="mt-4 h-1 w-0 bg-blue-600 rounded-full group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER SPACE (push to bottom) */}
      <div className="mt-auto"></div>
    </div>
  );
}
