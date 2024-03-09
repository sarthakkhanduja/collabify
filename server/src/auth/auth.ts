export {};
//require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GOOGLE_CLIENT_ID =
  "301470100800-2msf9ge20d6lte3ap4qu4bek6cc5svfu.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

interface Profile {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
  provider: string;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/v1/creator/auth/google/callback",
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: (err: any, user?: any) => void
    ) {
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {

      //   });
      return cb(null, profile);
    }
  )
);

passport.serializeUser((user: any, done: (err: any, user?: any) => void) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: (err: any, user?: any) => void) => {
  done(null, user);
});
