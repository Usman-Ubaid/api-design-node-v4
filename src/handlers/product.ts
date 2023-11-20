import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export interface UserType extends Request {
  user: { id: string; createdAt: Date; username: string; password: string };
}

// GET all
export const getProducts = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: (req as UserType).user?.id,
    },
    include: {
      products: true,
    },
  });

  res.json({ data: user?.products });
};

// GET one
export const getProductById = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const product = await prisma.product.findFirst({
    where: {
      id,
      belongsToId: (req as UserType)?.user.id,
    },
  });

  res.json({ data: product });
};

// Create Product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsToId: (req as UserType)?.user.id,
      },
    });

    res.json({ data: product });
  } catch (err) {
    (err as any).type = "input";
    next(err);
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  const updatedProduct = await prisma.product.update({
    where: {
      id: req.params.id,
      belongsToId: (req as UserType)?.user.id,
    },
    data: {
      name: req.body.name,
    },
  });

  res.json({ data: updatedProduct });
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  const deletedProduct = await prisma.product.delete({
    where: {
      id: req.params.id,
      belongsToId: (req as UserType)?.user.id,
    },
  });

  res.json({ data: deletedProduct });
};
