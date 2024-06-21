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
  channelId: string,
  channelName: string,
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

      // Finding the user ID from users table to add the same one in the creator table's foreign key column
      const currentUserId = insertUser.id;
      if (currentUserId === undefined) {
        throw new Error("User ID is undefined after insertion.");
      }

      const insertCreator = await prisma.creator.create({
        data: {
          userId: currentUserId,
          channelId,
          channelName,
        },
        select: {
          userId: true,
          channelId: true,
          channelName: true,
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

const redirectUrl = "http://localhost:3001/api/v1/creator/auth/google/callback";

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
      scope:
        "https://www.googleapis.com/auth/userinfo.profile openid email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload",
      prompt: "consent",
    });

    console.log("Auth URL: ", authorizeURL);

    // res.json({
    //   URL: authorizeURL,
    // });

    res.redirect(authorizeURL);
  }
);

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

    // Exchange authCode for tokens
    const { tokens } = await oAuth2Client.getToken(authCode);

    // Set access to make requests to API
    await oAuth2Client.setCredentials(tokens);

    const userCreds = oAuth2Client.credentials;
    console.log(userCreds);

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
    // console.log("Name: ", name);
    // console.log("Email: ", email);
    // console.log("Profile Picture: ", profilePictureLink);

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

      // Add this user to the DB, if not already existing
      let userInDB = await addUserToDB(
        email,
        name,
        profilePictureLink,
        "Creator",
        channelId,
        channelName,
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

    return res.status(210).json({
      message:
        "No YouTube Channel data was found. This application is specifically for YouTube creators. If you want to get started on creating a YouTube channel, you can follow an online guide.",
    });
  }
);

module.exports = router;
