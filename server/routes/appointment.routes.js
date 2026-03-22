import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
bookAppointment,
getBookedDates,
getProfessionalAppointments,
acceptAppointment,
rejectAppointment,
cancelAppointment,
getUserAppointments,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/book",authMiddleware,bookAppointment);

router.get("/booked/:id",getBookedDates);

router.get("/professional",authMiddleware,getProfessionalAppointments);

router.put("/accept/:id",authMiddleware,acceptAppointment);

router.put("/reject/:id",authMiddleware,rejectAppointment);

router.delete("/cancel/:id", authMiddleware, cancelAppointment);

router.get("/my", authMiddleware, getUserAppointments);

export default router;