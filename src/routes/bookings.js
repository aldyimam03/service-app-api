import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByPhone,
  updateBookingStatus,
  getBookingByStatus,
  getBookingStatistics,
} from "../controllers/bookingController.js";
import {
  validate,
  bookingSchema,
  updateStatusSchema,
  phoneSchema,
  validateIdParam,
  validateBookingDate,
} from "../middleware/validation.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", validate(bookingSchema), validateBookingDate, createBooking);
router.get("/:phone", validate(phoneSchema), getBookingByPhone);
router.get("/", authenticateToken, isAdmin, getAllBookings);
router.get("/statistics", authenticateToken, isAdmin, getBookingStatistics);
router.get("/status/:status", authenticateToken, isAdmin, getBookingByStatus);
router.get("/:id", authenticateToken, isAdmin, validateIdParam, getBookingById);
router.put(
  "/:id/status",
  authenticateToken,
  validateIdParam,
  isAdmin,
  validate(updateStatusSchema),
  updateBookingStatus
);

export default router;
