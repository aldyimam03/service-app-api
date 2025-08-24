export const createResponse = (
  success,
  message,
  data = null,
  errors = null
) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) {
    response.data = data;
  }

  if (errors !== null) {
    response.errors = errors;
  }

  return response;
};

export const successResponse = (
  res,
  message,
  data = null,
  statusCode = 200
) => {
  return res.status(statusCode).json(createResponse(true, message, data));
};

export const errorResponse = (
  res,
  message,
  errors = null,
  statusCode = 400
) => {
  return res
    .status(statusCode)
    .json(createResponse(false, message, null, errors));
};

export const createdResponse = (res, message, data = null) => {
  return successResponse(res, message, data, 201);
};

export const badRequestResponse = (res, message, errors = null) => {
    return errorResponse(res, message, errors, 400);
};

export const unauthorizedResponse = (res, message = "Unauthorized") => {
  return errorResponse(res, message, null, 401);
};

export const forbiddenResponse = (res, message = "Forbidden") => {
  return errorResponse(res, message, null, 403);
};

export const notFoundResponse = (res, message = "Not found", errors = null) => {
  return errorResponse(res, message, null, 404);
};

export const conflictResponse = (res, message, errors = null) => {
  return errorResponse(res, message, errors, 409);
};

export const serverErrorResponse = (res, message = "Internal server error") => {
  return errorResponse(res, message, null, 500);
};

export const validationErrorResponse = (res, errors = null) => {
  return badRequestResponse(res, "Validation failed", errors);
};
