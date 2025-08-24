import express from "express";
import {
  getAllSchedules,
  createSchedule,
  updateScheduleQuota,
  deleteSchedule,
} from "../controllers/scheduleController.js";
import {
  validate,
  scheduleSchema,
  updateQuotaSchema,
  validateIdParam,
} from "../middleware/validation.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, getAllSchedules);
router.post(
  "/",
  authenticateToken,
  isAdmin,
  validate(scheduleSchema),
  createSchedule
);
router.put(
  "/:id/quota",
  authenticateToken,
  isAdmin,
  validateIdParam,
  validate(updateQuotaSchema),
  updateScheduleQuota
);
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  validateIdParam,
  deleteSchedule
);

export default router;
