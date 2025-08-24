import Schedule from "../models/Schedule.js";
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  notFoundResponse,
  conflictResponse,
  serverErrorResponse,
} from "../utils/responses.js";

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.getAllSchedules();
    return successResponse(res, "Schedules retrieved successfully", {
      schedules,
      count: schedules.length,
    });
  } catch (error) {
    console.error("Get all schedules error:", error);
    return serverErrorResponse(res, "Failed to retrieve schedules");
  }
};

export const createSchedule = async (req, res) => {
  try {
    const { schedule_date, quota } = req.body;

    if (!schedule_date || !quota) {
      return badRequestResponse(res, "schedule_date and quota are required");
    }

    const scheduleId = await Schedule.create(req.body);
    const newSchedule = await Schedule.findById(scheduleId);

    return createdResponse(res, "Schedule created successfully", {
      schedule: newSchedule,
    });
  } catch (error) {
    console.error("Create schedule error:", error);

    if (
      error.message.includes("Duplicate entry") ||
      error.code === "ER_DUP_ENTRY"
    ) {
      return conflictResponse(res, "Schedule already exists for this date");
    }

    return serverErrorResponse(res, "Failed to create schedule");
  }
};

export const updateScheduleQuota = async (req, res) => {
  try {
    const { id } = req.params;
    const { quota } = req.body;

    const updated = await Schedule.updateQuota(id, quota);
    if (!updated) {
      return notFoundResponse(res, "Schedule not found");
    }

    const updatedSchedule = await Schedule.findById(id);

    return successResponse(res, "Schedule quota updated successfully", {
      schedule: updatedSchedule,
    });
  } catch (error) {
    console.error("Update schedule quota error:", error);
    return serverErrorResponse(res, "Failed to update schedule quota");
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Schedule.delete(id);
    if (!deleted) {
      return notFoundResponse(res, "Schedule not found");
    }

    return successResponse(res, `Schedule deleted with id ${id} successfully`);
  } catch (error) {
    console.error("Delete schedule error:", error);
    return serverErrorResponse(res, "Failed to delete schedule");
  }
};

export default {
  getAllSchedules,
  createSchedule,
  updateScheduleQuota,
  deleteSchedule,
};
