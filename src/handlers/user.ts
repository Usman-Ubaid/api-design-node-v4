import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../module/auth";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    const token = createJWT(user);
    if (token) {
      res.json({ token });
    }
  } catch (err) {
    (err as any).type = "input";
    next(err);
  }
};

export const signin = async (req: Request, res: Response) => {
  const { username, password }: { username: string; password: string } =
    req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (user?.password) {
    const isValid = comparePasswords(password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "wrong credentials" });
      return;
    }

    const token = createJWT(user);
    res.json({ token });
  }
};
