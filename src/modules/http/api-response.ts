import { Response } from "express";
import { ApiErrorResponse, ApiSuccessResponse } from "../../types/api-response.type";

const sendSuccess = <T>(response: Response, data: T, statusCode = 200): void => {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data
  };

  response.status(statusCode).json(payload);
};

const sendError = (
  response: Response,
  statusCode: number,
  code: string,
  message: string
): void => {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message
    }
  };

  response.status(statusCode).json(payload);
};

export { sendError, sendSuccess };
