import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  FileText,
  Calendar,
  Award,
  BriefcaseBusiness
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user] = React.useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const role = user?.role;

  // All possible cards
  const allCards = [
    { title: "Services", path: "/services", icon: <Briefcase size={28} />, color: "bg-blue-600", roles: ["user"] },
    { title: "Feed", path: "/feed", icon: <FileText size={28} />, color: "bg-blue-600", roles: ["user", "professional"] },
    { title: "Appointments", path: "/appointments", icon: <Calendar size={28} />, color: "bg-blue-600", roles: ["user", "professional"] },
    { title: "Connections", path: "/connections", icon: <Users size={28} />, color: "bg-blue-600", roles: ["user", "professional"] },
    { title: "Vacancies", path: "/vacancies", icon: <BriefcaseBusiness size={28} />, color: "bg-blue-600", roles: ["user", "professional"] },
    { title: "Generate Resume", path: "/resume", icon: <Award size={28} />, color: "bg-blue-600", roles: ["user", "professional"] },
  ];

  // Filter cards based on role
  const filteredCards = allCards.filter(card => card.roles.includes(role));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name || "User"}
        </h1>
        <p className="mt-2 text-gray-600">
          Role: {role || "N/A"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className={`cursor-pointer flex flex-col items-start p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ${card.color} text-white`}
          >
            <div className="p-4 bg-white/20 rounded-full mb-4">
              {card.icon}
            </div>
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-white/90 text-sm">
              Click to manage {card.title.toLowerCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
