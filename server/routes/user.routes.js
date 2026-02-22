import express from "express";
import { getProfessionalsByRole } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get professionals by their role/profession
router.get("/profession/:role", protect, getProfessionalsByRole);

// Other routes...
export default router;