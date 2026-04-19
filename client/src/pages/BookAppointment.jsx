// src/pages/BookAppointment.jsx
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

function BookAppointment() {
  const services = [
    "Teacher",
    "Developer",
    "Carpenter",
    "Plumber",
    "Electrician",
    "Designer",
  ];

  const [selectedService, setSelectedService] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH PROFESSIONALS ================= */
  useEffect(() => {
    if (!selectedService) {
      setProfessionals([]);
      return;
    }

    const fetchProfessionals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/connections/profession/${selectedService}`
        );
        setProfessionals(res.data);
      } catch (err) {
        console.error("Failed to fetch professionals:", err);
      }
    };

    fetchProfessionals();
  }, [selectedService]);

  /* ================= FETCH BOOKED ================= */
  useEffect(() => {
    if (!selectedProfessional) {
      setBookedAppointments([]);
      return;
    }

    const fetchBooked = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/booked/${selectedProfessional._id}`
        );
        setBookedAppointments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch booked:", err);
      }
    };

    fetchBooked();
  }, [selectedProfessional]);

  /* ================= BOOK / CANCEL ================= */
  const handleBookingToggle = async (date) => {
    if (!selectedProfessional) {
      alert("Please select a professional first!");
      return;
    }

    if (!token) {
      alert("You must be logged in to continue.");
      return;
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const existing = bookedAppointments.find(
      (a) =>
        new Date(a.date).toDateString() === selectedDate.toDateString() &&
        (a.status === "pending" || a.status === "accepted")
    );

    try {
      if (existing) {
        await axios.delete(
          `http://localhost:5000/api/appointments/cancel/${existing._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fix: compare as strings to avoid ObjectId strict equality mismatch
        setBookedAppointments((prev) =>
          prev.filter((a) => a._id.toString() !== existing._id.toString())
        );

        alert("Appointment cancelled successfully!");
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/appointments/book",
          {
            professionalId: selectedProfessional._id,
            service: selectedService,
            date: selectedDate.toISOString(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBookedAppointments((prev) => [...prev, res.data]);

        alert("Appointment booked successfully!");
      }

      setSelectedDay(null);
    } catch (err) {
      console.error("Booking error:", err.response || err);
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  /* ================= HELPERS ================= */
  const disablePastDates = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const tileClassName = ({ date }) => {
    const booked = bookedAppointments.find(
      (a) =>
        new Date(a.date).toDateString() === date.toDateString() &&
        (a.status === "pending" || a.status === "accepted")
    );

    if (booked)
      return "bg-green-400 text-white font-semibold rounded-full";

    if (date.toDateString() === new Date().toDateString())
      return "bg-blue-400 text-white font-semibold rounded-full";

    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            Schedule Appointment
          </h1>
          <p className="text-gray-500">
            Choose a service, select a professional, and book your preferred date
          </p>
        </div>

        {/* SERVICE */}
        <div className="mb-12">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Select Service
          </label>

          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setSelectedProfessional(null);
              setBookedAppointments([]);
              setSelectedDay(null);
            }}
            className="w-80 p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-blue-400 transition"
          >
            <option value="">Choose a service</option>
            {services.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* PROFESSIONALS */}
        {professionals.length > 0 && (
          <div className="mb-14">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Select Professional
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {professionals.map((pro) => (
                <div
                  key={pro._id}
                  onClick={() => setSelectedProfessional(pro)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    selectedProfessional?._id === pro._id
                      ? "bg-blue-100 border-blue-500 shadow-lg"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {pro.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {pro.professionalType}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALENDAR */}
        {selectedProfessional && (
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-3xl p-8 shadow-inner">
            <h2 className="text-xl font-semibold text-blue-700 mb-6 text-center">
              Choose Appointment Date
            </h2>

            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-lg border">
                <Calendar
                  onClickDay={(date) => setSelectedDay(date)}
                  tileDisabled={disablePastDates}
                  tileClassName={tileClassName}
                />
              </div>

              {selectedDay && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleBookingToggle(selectedDay)}
                    className={`px-6 py-2 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                      bookedAppointments.find(
                        (a) =>
                          new Date(a.date).toDateString() ===
                            selectedDay.toDateString() &&
                          (a.status === "pending" || a.status === "accepted")
                      )
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {bookedAppointments.find(
                      (a) =>
                        new Date(a.date).toDateString() ===
                          selectedDay.toDateString() &&
                        (a.status === "pending" || a.status === "accepted")
                    )
                      ? "Cancel Appointment"
                      : "Confirm Booking"}
                  </button>

                  <button
                    onClick={() => setSelectedDay(null)}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
                  >
                    Clear
                  </button>
                </div>
              )}

              <p className="mt-5 text-gray-500 text-sm text-center">
                Select a date and confirm your booking or cancel an existing one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookAppointment;