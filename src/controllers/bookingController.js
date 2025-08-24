import Booking from "../models/Booking.js";
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
} from "../utils/responses.js";

export const createBooking = async (req, res) => {
  try {
    const bookingId = await Booking.create(req.body);
    const newBooking = await Booking.findById(bookingId);

    return createdResponse(res, "Booking created", { booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return serverErrorResponse(res, error.message);
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    return successResponse(res, "Bookings retrieved", {
      bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    return serverErrorResponse(res, "Failed to retrieve bookings");
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return notFoundResponse(res, "Booking not found");
    }
    return successResponse(res, "Booking retrieved", { booking });
  } catch (error) {
    console.error("Get booking by ID error:", error);
    return serverErrorResponse(res, "Failed to retrieve booking");
  }
};

export const getBookingByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone) return badRequestResponse(res, "Phone number required");

    const bookings = await Booking.findByPhone(phone);

    if (bookings.length === 0) {
      return notFoundResponse(res, "No bookings found for this phone number");
    }

    return successResponse(res, "Bookings retrieved successfully", {
      bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Get bookings by phone error:", error);
    return serverErrorResponse(res, "Failed to retrieve bookings");
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_status_id } = req.body;

    if (!service_status_id) {
      return badRequestResponse(res, "service_status_id is required");
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return notFoundResponse(res, "Booking not found");
    }

    const updated = await Booking.updateStatus(id, service_status_id);
    if (!updated) {
      return badRequestResponse(res, "Failed to update booking status");
    }

    const updatedBooking = await Booking.findById(id);

    return successResponse(res, "Booking status updated", {
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    return serverErrorResponse(res, "Failed to update booking status");
  }
};

export const getBookingByStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const statusIdNum = parseInt(statusId);
    if (isNaN(statusIdNum) || statusId < 1 || statusId > 5) {
      return badRequestResponse(res, "Invalid status ID");
    }

    const bookings = await Booking.findByStatus(statusId);

    const statusNames = {
      1: "menunggu konfirmasi",
      2: "konfirmasi batal",
      3: "konfirmasi datang",
      4: "tidak datang",
      5: "datang",
    };

    if (bookings.length === 0) {
      return notFoundResponse(
        res,
        `Bookings with status '${statusNames[statusIdNum]}' not found`
      );
    }

    return successResponse(
      res,
      `Bookings with status '${statusNames[statusIdNum]}' retrieved successfully`,
      {
        bookings,
        count: bookings.length,
      }
    );
  } catch (error) {
    console.error("Get bookings by status error:", error);
    return serverErrorResponse(res, "Failed to retrieve bookings");
  }
};

export const getBookingStatistics = async (req, res) => {
  try {
    const stats = await Booking.getStatistics();
    return successResponse(res, "Booking statistics retrieved", stats);
  } catch (error) {
    console.error("Get booking statistics error:", error);
    return serverErrorResponse(res, "Failed to retrieve booking statistics");
  }
};

export default {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByPhone,
  updateBookingStatus,
  getBookingByStatus,
  getBookingStatistics,
};
