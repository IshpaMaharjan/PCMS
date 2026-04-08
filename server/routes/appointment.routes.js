import express from "express";
import { rateProfessional } from "../controllers/appointment.controller.js";
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

router.post("/rate/:id", authMiddleware, rateProfessional);

export default router;