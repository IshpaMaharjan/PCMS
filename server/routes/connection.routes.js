import express from "express";
import {
  sendRequest,
  acceptRequest,
  getMyConnections,
  searchUsers,
  getProfessionalsByRole
} from "../controllers/connection.controller.js";
import authmiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send/:id", authmiddleware, sendRequest);
router.put("/accept/:id", authmiddleware, acceptRequest);
router.get("/my", authmiddleware, getMyConnections);
router.get("/search", authmiddleware, searchUsers);
router.get("/profession/:role", getProfessionalsByRole);

export default router;
