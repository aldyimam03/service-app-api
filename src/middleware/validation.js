import Joi from "joi";
import { validationErrorResponse } from "../utils/responses.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/['"]+/g, ""),
      }));
      return validationErrorResponse(res, errors);
    } else {
      req.body = value;
      next();
    }
  };
};

export const loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(50),
  password: Joi.string().required().min(6),
});

export const bookingSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  phone_no: Joi.string()
    .required()
    .pattern(/^[0-9+\-\s()]{10,20}$/),
  vehicle_type: Joi.string().required().min(2).max(50),
  license_plate: Joi.string().required().min(1).max(20).uppercase(),
  vehicle_problem: Joi.string().required().min(10).max(1000),
  service_schedule_id: Joi.number().integer().positive().required(),
  service_time: Joi.string()
    .required()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  service_status_id: Joi.number().integer().positive().default(1),
});

export const scheduleSchema = Joi.object({
  schedule_date: Joi.date().greater("now").required(),
  quota: Joi.number().integer().min(1).max(20).required(),
});

export const updateQuotaSchema = Joi.object({
  quota: Joi.number().integer().min(1).max(20).required(),
});

export const updateStatusSchema = Joi.object({
  service_status_id: Joi.number().integer().positive().required(),
});

export const phoneSchema = Joi.object({
  phone_no: Joi.string()
    .required()
    .pattern(/^[0-9+\-\s()]{10,20}$/),
});

export const validateBookingDate = (req, res, next) => {
  const { schedule_date } = req.body;
  const bookingDate = new Date(schedule_date);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  if (bookingDate < tomorrow) {
    return validationErrorResponse(res, [
      {
        field: "schedule_date",
        message: "Booking date must be at least tomorrow",
      },
    ]);
  }

  next();
};

export const validateIdParam = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return validationErrorResponse(res, [
      {
        field: "id",
        message: "Invalid ID parameter",
      },
    ]);
  }

  req.params.id = id;
  next();
};
