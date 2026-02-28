import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    { name: "Teacher", image: "/images/teacher.jpg" },
    { name: "Developer", image: "/images/developer.jpg" },
    { name: "Carpenter", image: "/images/carpenter.jpg" },
    { name: "Plumber", image: "/images/plumber.jpg" },
    { name: "Electrician", image: "/images/electrician.jpg" },
    { name: "Designer", image: "/images/designer.jpg" },
    { name: "Photographer", image: "/images/photographer.jpg" },
    { name: "Babysitter", image: "/images/babysitter.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-10">
      
      {/* TITLE */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Explore Our Professional Services
        </h2>
        <p className="text-gray-500 text-lg">
          Find trusted professionals across multiple industries.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
          >
            {/* IMAGE */}
            <div className="h-48 overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {service.name}
              </h3>

              <button
                onClick={() => navigate(`/professionals/${service.name}`)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:scale-105 transition duration-300 shadow-md hover:shadow-lg"
              >
                View Professionals
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
