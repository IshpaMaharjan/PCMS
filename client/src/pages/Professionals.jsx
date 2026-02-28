import { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
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
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-6 capitalize">
        {role} Professionals
      </h2>

      {loading && <p>Loading...</p>}

      {!loading && professionals.length === 0 && (
        <p>No professionals found.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {professionals.map((pro) => (
          <div
            key={pro._id}
            onClick={() => handleCardClick(pro._id)}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h3 className="text-lg font-semibold">{pro.name}</h3>
            <p className="text-gray-500">{pro.role}</p>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Click to view profile
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}