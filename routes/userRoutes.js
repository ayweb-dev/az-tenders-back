// routes/userRoutes.js
import express from "express";
import {
  addMessage,
  askForSubscription,
  checkSubscription,
  getSingleTender,
  updatePassword,
  updatePersonalInfo,
  updateProfile,
  checkSubscriptionByParam,
  addFavorite,
  removeFavorite,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//compléter les champs manquant de user après la connexion avec google
router.post("/update-profile", updateProfile);

//Mettre à jour profile & password
router.post("/update-password",protect, updatePassword);
router.post("/update-personal-info",protect, updatePersonalInfo);

//Demande d'abonnement
router.post("/askSubscription", protect, askForSubscription);
router.get("/checkSubscription", protect, checkSubscription);
router.get("/checkSubscriptionByParam/:id", protect, checkSubscriptionByParam);


router.get("/tender/:id", protect, getSingleTender);

//Messages
router.post("/message", addMessage);

router.post("/favorites/:tenderId", protect, addFavorite);
router.delete("/favorites/:tenderId", protect, removeFavorite);

export default router;
