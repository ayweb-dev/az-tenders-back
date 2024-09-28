import express from "express";
import passport from "passport";
import {
  signup,
  login,
  logout,
  googleAuth,
  googleAuthCallback,
  // completeProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/google", googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthCallback
);
// router.get("/completeProfile", completeProfile); //la page du formulaire

export default router;
