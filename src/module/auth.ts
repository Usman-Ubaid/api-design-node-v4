import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { NextFunction, Request, Response, RequestHandler } from "express";

type User = {
  id: string;
  username: string;
};

interface CustomRequest extends Request {
  user: string | jwt.JwtPayload;
}

const saltRounds = 5;

export const comparePasswords = (password: string, hashPassword: string) => {
  return bcrypt.compare(password, hashPassword);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const createJWT = (user: User) => {
  if (process.env.JWT_SECRET) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    return token;
  }
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "Not Authorized" });
    return;
  }

  const [_, token] = bearer.split(" ");
  if (!token) {
    res.status(401);
    res.json({ message: "Not Valid Token" });
    return;
  }

  try {
    if (process.env.JWT_SECRET) {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      (req as CustomRequest).user = user;
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(401);
    res.json({ message: "Not Valid Token" });
    return;
  }
};
