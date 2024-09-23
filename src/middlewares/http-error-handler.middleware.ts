import { Request, Response, NextFunction } from "express";
import { HttpErrorException } from "../exceptions/http-error.exception";

export function httpErrorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof HttpErrorException) {
    return res.status(err.statusCode).send({
      message: err.message,
      success: false,
      statusCode: err.statusCode,
    });
  }

  return res.status(500).send("Something went wrong");
}
