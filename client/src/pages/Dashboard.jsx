import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to blog / landing page
    navigate("/", { replace: true });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.name}
      </h1>

      <p className="mt-2 text-gray-600">
        Role: {user?.role}
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
