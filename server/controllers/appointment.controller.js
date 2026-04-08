import Appointment from "../models/Appointment.model.js";
import User from "../models/User.model.js";

/* ================= BOOK ================= */
export const bookAppointment = async (req, res) => {
  try {
    const { professionalId, service, date } = req.body;

    const selectedDate = new Date(date);

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const existing = await Appointment.findOne({
      professional: professionalId,
      date: { $gte: start, $lte: end },
      status: { $in: ["pending", "accepted"] }, // ✅ only active bookings
    });

    if (existing) {
      return res.status(400).json({
        message: "This date is already booked",
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      professional: professionalId,
      service,
      date: start,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET BOOKED ================= */
export const getBookedDates = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      professional: req.params.id,
      status: { $in: ["pending", "accepted"] }, // ✅ ignore rejected
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= PROFESSIONAL ================= */
export const getProfessionalAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      professional: req.user._id,
    })
      .populate("user", "name email")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ACCEPT ================= */
export const acceptAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    appointment.status = "accepted";

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REJECT (PROFESSIONAL ONLY) ================= */
export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    appointment.status = "rejected";

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CANCEL (USER) ================= */
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    await Appointment.findByIdAndDelete(req.params.id); // ✅ DELETE

    res.json({ message: "Cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= My Appointments (USER) ================= */
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.user._id,
    })
      .populate("professional", "name professionalType")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= RATE PROFESSIONAL ================= */
export const rateProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only allow rating if accepted
    if (appointment.status !== "accepted") {
      return res.status(400).json({ message: "Cannot rate this appointment" });
    }

    // Prevent duplicate rating
    if (appointment.rating) {
      return res.status(400).json({ message: "Already rated" });
    }

    // Save rating
    appointment.rating = rating;
    await appointment.save();

    /* ================= UPDATE PROFESSIONAL AVG RATING ================= */
    const professional = await User.findById(appointment.professional);

    const totalRating =
      professional.rating * professional.numReviews + rating;

    professional.numReviews += 1;
    professional.rating = totalRating / professional.numReviews;

    await professional.save();

    res.json({ message: "Rating submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};