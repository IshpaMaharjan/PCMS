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

  const allCards = [
    { title: "Services", path: "/services", icon: <Briefcase size={28} />, roles: ["user"] },
    { title: "Feed", path: "/feed", icon: <FileText size={28} />, roles: ["user", "professional"] },
    { title: "Appointments", path: "/appointments", icon: <Calendar size={28} />, roles: ["user", "professional"] },
    { title: "Connections", path: "/connections", icon: <Users size={28} />, roles: ["user", "professional"] },
    { title: "Vacancies", path: "/vacancies", icon: <BriefcaseBusiness size={28} />, roles: ["user", "professional"] },
    { title: "Edit Profile", path: "/edit-profile", icon: <Award size={28} />, roles: ["user", "professional"] },
    { title: "Generate Resume", path: "/resume", icon: <Award size={28} />, roles: ["user", "professional"] },
  ];

  const filteredCards = allCards.filter(card => card.roles.includes(role));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div
        className="relative h-[80vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Connect. Collaborate. Grow.
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl">
            Manage your professional connections, explore services,
            schedule appointments, and grow your career all in one place.
          </p>

          <div className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 transition rounded-full text-lg font-semibold shadow-xl">
            Welcome, {user?.name || "User"} ({role})
          </div>
        </div>
      </div>


      {/* FEATURES SECTION */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="p-4 bg-blue-600 text-white rounded-xl w-fit mb-5">
                {card.icon}
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {card.title}
              </h2>

              <p className="text-gray-500 text-sm">
                Click to manage {card.title.toLowerCase()}.
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
