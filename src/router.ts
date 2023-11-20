import { Router } from "express";
import { body, oneOf, validationResult } from "express-validator";
import { handleInputError } from "./module/middleware";
import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getUpdate,
  getUpdateById,
  updateUpdate,
} from "./handlers/update";

const router = Router();

// PRODUCT ROUTES

router.get("/product", getProducts);

router.get("/product/:id", getProductById);

router.post(
  "/product",
  body("name").isString(),
  handleInputError,
  createProduct
);

router.put(
  "/product/:id",
  body("name").isString(),
  handleInputError,
  updateProduct
);

router.delete("/product/:id", deleteProduct);

// UPDATE ROUTES

router.get("/update", getUpdate);

router.get("/update/:id", getUpdateById);

router.post(
  "/update",
  body("title").isString(),
  body("body").isString(),
  body("productId").isString(),
  handleInputError,
  createUpdate
);

router.put(
  "/update/:id",
  body("title").optional(),
  body("body").optional(),
  body("statuses").isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]).optional(),
  body("version").optional(),
  updateUpdate
);

router.delete("/update/:id", deleteUpdate);

//  UPDATEPOINT ROUTES

router.get("/updatepoint", () => {});

router.get("/updatepoint/:id", () => {});

router.post(
  "/updatepoint",
  body("name").isString(),
  body("description").isString(),
  body("updateId").isString(),
  (req, res) => {}
);

router.put(
  "/updatepoint/:id",
  body("name").isString().optional(),
  body("description").isString().optional(),
  (req, res) => {}
);

router.delete("/updatepoint/:id", () => {});

export default router;
