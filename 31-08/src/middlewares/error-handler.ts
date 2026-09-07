import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(500).json({
    ok: false,
    message: 'Error interno del servidor',
    error: err.message,
  });
};
