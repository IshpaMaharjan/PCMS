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
    <div className="p-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Explore Our Services
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
          >
            {/* IMAGE */}
            <div className="h-40 overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover hover:scale-110 transition duration-300"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-grow justify-between">
              <h3 className="text-lg font-semibold text-center mb-4">
                {service.name}
              </h3>

              <button
                onClick={() =>
                  navigate(`/professionals/${service.name}`)
                }
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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