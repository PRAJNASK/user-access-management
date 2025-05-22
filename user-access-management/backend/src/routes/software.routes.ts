import { Router } from "express";
import { createSoftware, getAllSoftware } from "../controllers/software.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Admin only: create software
router.post(
  "/create",
  authenticateJWT,
  authorizeRoles("Admin"),
  createSoftware
);

// Public or authenticated users: view all software
router.get("/", authenticateJWT, getAllSoftware);

export default router;
