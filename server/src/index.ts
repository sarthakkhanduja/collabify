export {};
const express = require("express");
const session = require("express-session");
const passport = require("passport");
import { Request, Response } from "express";
const mainRouter = require("./routes/mainRouter");

const PORT: number = 3001;

const app = express();

// Use express-session middleware
app.use(
  session({
    secret: "your-secret-key", // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", mainRouter);

app.listen(PORT, (err: String) => {
  if (err) {
    console.log(err);
  }
  console.log("Server is listening on PORT:", PORT);
});
