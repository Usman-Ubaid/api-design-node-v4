import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const handleInputError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    res.json({ errors: errors.array() });
  } else {
    next();
  }
};
