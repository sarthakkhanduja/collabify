export {};
const express = require("express");
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
require("../auth/auth");
require("dotenv").config();

const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

const prisma = new PrismaClient();

async function addUserToDB(
  email: string,
  name: string,
  profilePictureLink: string,
  role: string,
  refreshToken: string
) {
  const userPresent = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  console.log(userPresent);

  if (!userPresent) {
    try {
      const insertUser = await prisma.user.create({
        data: {
          email,
          name,
          profilePictureLink,
          role,
          refreshToken,
        },
        select: {
          id: true,
          email: true,
          name: true,
          profilePictureLink: true,
          role: true,
          refreshToken: true,
        },
      });
      console.log("Added into User DB");

      // Finding the user ID from users table to add the same one in the contributor table's foreign key column
      const currentUserId = insertUser.id;
      if (currentUserId === undefined) {
        throw new Error("User ID is undefined after insertion.");
      }

      const insertContributor = await prisma.contributor.create({
        data: {
          userId: currentUserId,
        },
        select: {
          userId: true,
        },
      });

      console.log("Added into both DBs");

      return 200;
    } catch (e) {
      console.error(e);
      return 410;
    }
  } else {
    console.log("User already in DB");
    return 300;
  }
}

const redirectUrl =
  "http://localhost:3001/api/v1/contributor/auth/google/callback";

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl
);

router.post(
  "/auth/google",
  async (req: Request, res: Response, next: () => void) => {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");

    const authorizeURL = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
        "email",
      ],
      prompt: "consent",
    });

    console.log("Auth URL: ", authorizeURL);

    res.redirect(authorizeURL);
  }
);

router.get(
  "/auth/google/callback",
  async (req: Request, res: Response, next: () => void) => {
    console.log("Request: ", req.query.code);

    if (!req.query.code) {
      return res.status(400).json({
        message:
          "User did not grant permissions required to login to Collabify",
      });
    }

    const authCode = req.query.code;

    // Exchange authCode for tokens
    const { tokens } = await oAuth2Client.getToken(authCode);

    // Set access to make requests to API
    await oAuth2Client.setCredentials(tokens);

    const userCreds = oAuth2Client.credentials;
    console.log(userCreds);

    // Fetch user info using Google's OAuth2 API
    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });

    const userProfile = await oauth2.userinfo.get();

    const name = userProfile.data.name;
    const email = userProfile.data.email;
    const profilePictureLink = userProfile.data.picture;

    console.log("User Profile:", userProfile.data);

    let userInDB = await addUserToDB(
      email,
      name,
      profilePictureLink,
      "Contributor",
      userCreds.refresh_token
    );
    if (userInDB === 300) {
      console.log("User already exists in the database");
      return res.status(300).json({
        message: "User already exists in the database",
        access_token: userCreds.access_token,
      });
    } else if (userInDB === 410) {
      console.log("Error while adding user to DB");
      return res.status(410).json({
        message: "There was an error adding the user to the DB",
      });
    } else if (userInDB === 200) {
      console.log("Done");
      return res.status(200).json({
        message: "User has been successfully added to the DB",
        access_token: userCreds.access_token,
      });
    }
  }
);

module.exports = router;
