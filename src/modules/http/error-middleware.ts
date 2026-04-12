import { NextFunction, Request, Response } from "express";
import { AppError } from "./app-error";
import { sendError } from "./api-response";

const notFoundHandler = (request: Request, response: Response): void => {
  sendError(
    response,
    404,
    "ENDPOINT_NOT_FOUND",
    `Route ${request.method} ${request.originalUrl} was not found`
  );
};

const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    sendError(response, error.statusCode, error.code, error.message);
    return;
  }

  console.error("Unexpected server error", error);
  sendError(response, 500, "INTERNAL_SERVER_ERROR", "An unexpected server error occurred");
};

export { errorHandler, notFoundHandler };
