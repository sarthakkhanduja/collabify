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

router.post("/", async (req: Request, res: Response, next: () => void) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl =
    "http://localhost:3001/api/v1/creator/auth/google/callback";

  // console.log("ID: ", process.env.GOOGLE_CLIENT_ID);
  // console.log("Secret: ", process.env.GOOGLE_CLIENT_SECRET);

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile openid email https://www.googleapis.com/auth/youtube.readonly",
    prompt: "consent",
  });

  console.log("Auth URL: ", authorizeUrl);

  res.json({
    url: authorizeUrl,
  });
});

router.get(
  "/auth/google/callback",
  async (req: Request, res: Response, next: () => void) => {
    // Authorization code received in the query
    console.log("Request: ", req.query.code);

    if (!req.query.code) {
      return res.status(400).json({
        message:
          "User did not grant permissions required to login to Collabify",
      });
    }

    const authCode = req.query.code;

    // Create the oAuth2.0 Client once again
    const redirectUrl =
      "http://localhost:3001/api/v1/creator/auth/google/callback";

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );

    // Exchange authCode for tokens
    const { tokens } = await oAuth2Client.getToken(authCode);
    console.log(tokens);

    // Set access to make requests to API
    await oAuth2Client.setCredentials(tokens);

    const userCreds = oAuth2Client.credentials;

    console.log("#############");
    console.log(userCreds);
    console.log("#############");

    // Till here the whole Google Authentication Flow was done
    // Now we will use these tokens to access the APIs

    // Create People API client
    const people = google.people({
      version: "v1",
      auth: oAuth2Client, // Use OAuth2 client for authorization
    });

    // Fetch user data from People API
    const userProfile = await people.people.get({
      resourceName: "people/me",
      personFields: "names,emailAddresses,photos",
    });

    // Extract user data from the response
    const name = userProfile.data.names?.[0].displayName;
    const email = userProfile.data.emailAddresses?.[0].value;
    const profilePictureLink = userProfile.data.photos?.[0].url;

    console.log("User Profile:", userProfile);
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Profile Picture: ", profilePictureLink);

    // Now we will do YouTube API
    // Create YouTube Data API client
    const youtube = google.youtube({
      version: "v3",
      auth: oAuth2Client, // Use OAuth2 client for authorization
    });

    // Fetch channel data from YouTube Data API
    const channelData = await youtube.channels.list({
      part: "snippet",
      mine: true,
    });

    // console.log(channelData);

    // Extract channel data from the response
    if (
      channelData.hasOwnProperty("data") &&
      channelData.data.hasOwnProperty("items") &&
      channelData.data.items.length > 0
    ) {
      const channelName = channelData.data.items[0].snippet.title;
      const channelId = channelData.data.items[0].id;

      console.log("Channel Name: ", channelName);
      console.log("Channel ID: ", channelId);

      // Check if the DB already has this user
      const userPresent = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      console.log(userPresent);

      if (!userPresent) {
        const insertUser = await prisma.user.create({
          data: {
            email,
            name,
            profilePictureLink,
          },
          select: {
            email: true,
            name,
            profilePictureLink,
          },
        });
      }
      return res.status(200).json({
        message: "tokens acquired",
        access_token: userCreds.access_token,
        name: name,
        email: email,
        profilePicture: profilePictureLink,
        channelName,
        channelId,
      });
    }

    return res.status(210).json({
      message:
        "No YouTube Channel data was found. This application is specifically for YouTube creators. If you want to get started on creating a YouTube channel, you can follow an online guide.",
      access_token: userCreds.access_token,
      name: name,
      email: email,
      profilePicture: profilePictureLink,
    });
  }
);

module.exports = router;
