export {};
const express = require("express");
import { Request, Response } from "express";
const router = express.Router();
const creatorRouter = require("./creatorRouter");

router.use("/creator", creatorRouter);

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the Main Router",
  });
});

module.exports = router;
