import { useEffect, useState } from "react";
import axios from "axios";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "http://localhost:5000/api/appointments/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointments(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error fetching appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading your appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
          📅 My Appointments
        </h1>

        {/* EMPTY STATE */}
        {appointments.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow">
            <p className="text-gray-500 text-lg">
              You have no appointments yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
              >
                {/* TOP */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {appt.professional?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {appt.professional?.professionalType}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      appt.status
                    )}`}
                  >
                    {appt.status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>
                    <span className="font-medium">Service:</span>{" "}
                    {appt.service}
                  </p>

                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(appt.date).toLocaleDateString()}
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-5 flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    Booked on{" "}
                    {new Date(appt.createdAt).toLocaleDateString()}
                  </p>

                  {(appt.status === "pending" ||
                    appt.status === "accepted") && (
                    <button
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `http://localhost:5000/api/appointments/cancel/${appt._id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );

                          setAppointments((prev) =>
                            prev.filter((a) => a._id !== appt._id)
                          );

                          alert("Appointment cancelled!");
                        } catch (err) {
                          console.error(err);
                          alert("Cancel failed");
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}