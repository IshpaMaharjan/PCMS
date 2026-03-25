import express from "express";
import {
  createVacancy,
  getVacancies,
  deleteVacancy,
} from "../controllers/vacancy.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a vacancy (professional only)
router.post("/", authMiddleware, createVacancy);

// Get all vacancies
router.get("/", authMiddleware, getVacancies);

// Delete a vacancy
router.delete("/:id", authMiddleware, deleteVacancy);

export default router;