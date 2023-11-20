import prisma from "../db";
import { Response, Request } from "express";
import { UserType } from "./product";
import { UDPATE_STATUS } from "@prisma/client";

// GET Update

export const getUpdate = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: (req as UserType).user.id,
    },
    include: { updates: true },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, [] as { id: string; createdAt: Date; updatedAt: Date; title: string; body: string; statuses: UDPATE_STATUS; version: string | null; asset: string | null; productId: string }[]);

  res.json({ data: updates });
};

// GET one

export const getUpdateById = async (req: Request, res: Response) => {
  const product = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: product });
};

// Create Update

export const createUpdate = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (!product) {
    return res.json({ message: "This product does not belong to you" });
  }

  const update = await prisma.update.create({
    data: req.body,
  });

  res.json({ data: update });
};

// Update Update

export const updateUpdate = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      id: (req as UserType).user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, [] as { id: string; createdAt: Date; updatedAt: Date; title: string; body: string; statuses: UDPATE_STATUS; version: string | null; asset: string | null; productId: string }[]);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    return res.json({ message: "No update found" });
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
};

export const deleteUpdate = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      id: (req as UserType).user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, [] as { id: string; createdAt: Date; updatedAt: Date; title: string; body: string; statuses: UDPATE_STATUS; version: string | null; asset: string | null; productId: string }[]);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    return res.json({ message: "No update found" });
  }

  const deleteUpdate = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deleteUpdate });
};
