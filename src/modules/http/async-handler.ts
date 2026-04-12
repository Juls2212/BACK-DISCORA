import { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;

const asyncHandler = (handler: AsyncRouteHandler) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    void handler(request, response, next).catch(next);
  };
};

export { asyncHandler };
