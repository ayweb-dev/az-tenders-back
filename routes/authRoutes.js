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
  (err, req, res, next) => {
    // Gestion des erreurs
    if (err && err.name === 'TokenError') {
      // Redirige vers la page d'authentification Google en cas d'erreur liée au token
      return res.redirect('/auth/google');
    }
    // Si une autre erreur survient, passez à la gestion suivante ou loggez l'erreur
    next(err);
  },
  googleAuthCallback // Votre callback Google en cas de succès
);

// router.get("/completeProfile", completeProfile); //la page du formulaire

export default router;
