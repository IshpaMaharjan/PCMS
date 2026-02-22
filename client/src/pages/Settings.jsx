import { useNavigate } from "react-router-dom";
import { User, Settings, Star, Bell, HelpCircle, LogOut } from "lucide-react";

const Setting = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const settingsOptions = [
    { title: "My Profile", icon: <User size={24} />, path: "/profile" },
    { title: "Themes", icon: <Star size={24} />, path: "/themes" },
    { title: "Help & Support", icon: <HelpCircle size={24} />, path: "/help" },
    { title: "Logout", icon: <LogOut size={24} />, path: "/logout" },
  ];

  const handleClick = (path) => {
    if (path === "/logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* User Card (optional profile summary) */}
      <div className="bg-white w-full max-w-sm rounded-xl shadow-md p-6 mb-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={40} className="text-gray-600" />
          </div>

          <h2 className="text-xl font-semibold">{user.name || "User Name"}</h2>
          <p className="text-gray-500 text-sm">{user.email || "email@example.com"}</p>
        </div>
      </div>

      {/* Settings Options Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
        {settingsOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleClick(option.path)}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200"
          >
            <div className="text-gray-700 mb-2">{option.icon}</div>
            <span className="text-gray-800 font-medium text-sm">{option.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Setting;
