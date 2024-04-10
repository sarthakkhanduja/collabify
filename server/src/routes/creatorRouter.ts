export {};
const express = require("express");
import { Request, Response } from "express";
require("../auth/auth");
require("dotenv").config();

const router = express.Router();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

router.post("/", async (req: Request, res: Response, next: () => void) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
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

    // Set access to make requests to API
    await oAuth2Client.setCredentials(tokens);

    const userCreds = oAuth2Client.credentials;

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
    const profilePicture = userProfile.data.photos?.[0].url;

    console.log("User Profile:", userProfile);
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Profile Picture: ", profilePicture);

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

    console.log(channelData);

    // Extract channel data from the response
    if (channelData.hasOwnProperty("items")) {
      const channelName = channelData.data.items[0].snippet.title;
      const channelId = channelData.data.items[0].id;

      console.log("Channel Name: ", channelName);
      console.log("Channel ID: ", channelId);

      return res.status(200).json({
        message: "tokens acquired",
        access_token: userCreds.access_token,
        name: name,
        email: email,
        profilePicture: profilePicture,
        channelName,
        channelId,
      });
    }

    return res.status(200).json({
      message: "tokens acquired",
      access_token: userCreds.access_token,
      name: name,
      email: email,
      profilePicture: profilePicture,
    });
  }
);

module.exports = router;
