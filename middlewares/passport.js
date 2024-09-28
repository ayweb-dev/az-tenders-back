import dotenv from 'dotenv';
dotenv.config();
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { User } from "../models/userModel.js";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// import { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } from "../config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Vérifiez si l'utilisateur existe déjà
        const user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // Créez un nouvel utilisateur si nécessaire
        const newUser = await User.create({
          googleId: profile.id,
          nom: profile.name.givenName || profile.name.email.split('@')[0],
          prenom: profile.name.familyName || profile.name.givenName,
          email: profile.emails[0].value,
          password: undefined,
        });
        console.log(newUser);
        
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
