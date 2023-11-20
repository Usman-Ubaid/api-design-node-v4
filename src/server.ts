import express from "express";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./module/auth";
import { createNewUser, signin } from "./handlers/user";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Hello from Server");
  res.status(200);
  res.json({ message: "Server running succesfully" });
});

app.use("/api", protect, router);
app.post("/user", createNewUser);
app.post("/signin", signin);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ message: "Not authorized" });
  } else if (err.type === "input") {
    res.status(400).json({ message: "invalid input" });
  } else {
    res.status(500).json({ message: "Server Error" });
  }
};

app.use(errorHandler);

export default app;
