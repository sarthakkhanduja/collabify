export {};
const express = require("express");
const passport = require("passport");
import { Request, Response } from "express";
require("../auth/auth");
const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: any;
}

function isLoggedIn(
  req: AuthenticatedRequest,
  res: Response,
  next: () => void
) {
  req.user ? next() : res.status(401).json({ message: "Unauthorized" });
}

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "I am a YouTuber",
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Handle callback from Google OAuth2 authentication
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/creator/auth/loginFail",
  }),
  function (req: Request, res: Response) {
    // Successful authentication, redirect to home page or dashboard
    res.redirect("/api/v1/creator/auth/success");
  }
);

router.get(
  "/auth/success",
  isLoggedIn,
  (req: AuthenticatedRequest, res: Response) => {
    // console.log(req.user);
    const userName = req.user.displayName;
    res.status(200).json({
      message: `Hi ${userName}`,
    });
  }
);

router.get("/auth/loginFail", isLoggedIn, (req: Request, res: Response) => {
  res.status(200).json({
    message: "Login Failed",
  });
});

router.get(
  "/random",
  isLoggedIn,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      message: "This is RANDOM!",
    });
  }
);

module.exports = router;
