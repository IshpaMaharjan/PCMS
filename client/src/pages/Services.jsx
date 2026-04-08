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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white px-6 md:px-10 py-16">
      
      {/* TITLE */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Explore Our Professional Services
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Discover trusted professionals across multiple industries and connect with the right experts effortlessly.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="group relative bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-3"
          >
            {/* IMAGE */}
            <div className="h-52 overflow-hidden relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-blue-600 transition">
                {service.name}
              </h3>

              <button
                onClick={() => navigate(`/professionals/${service.name}`)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:scale-105 transition duration-300 shadow-md hover:shadow-xl"
              >
                View Professionals
              </button>

              {/* Bottom Accent */}
              <div className="mt-5 h-1 w-0 bg-blue-600 rounded-full group-hover:w-full transition-all duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}