import express from "express";
import {
  addAdmin,
  addMessage,
  addSector,
  addTender,
  assignSubscription,
  checkAdminAccess,
  /*updateAdmin, */ deleteAdmin,
  deleteMessage,
  deleteSector,
  deleteSubscription,
  deleteTender,
  deleteUser,
  getAdmins,
  getEntreprises,
  getJournals,
  getMessages,
  getSectors,
  getSingleSubscriptions,
  getSingleTender,
  getStats,
  getSubscriptions,
  getTenders,
  getTendersByIds,
  getUsers,
  getUsersByID,
  getUsersInfos,
  markAsSeenMessage,
  updateAdminInfo,
  updatePassword,
  updatePasswordAdmin,
  updatePersonalInfo,
  updateSector,
  updateSubscription,
  updateTender,
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

//Tender routes
router.post("/tender", protect, upload.single("image"), addTender); //add a new tender
router.get("/tenders", getTenders); //récupérer tous les tenders
router.post("/getByIds",protect, getTendersByIds); //récupérer tous les tenders
router.get("/tend/:id", protect, restrictTo("admin", "super admin"), getSingleTender);
router.put("/tender/:id", upload.single("image"), updateTender); // Update a specific tender
router.delete("/tender/:id", protect, restrictTo("admin", "super admin"), deleteTender); //delete a specific tender

//Secteur routes
router.post("/sector", protect, restrictTo("admin", "super admin"),addSector);
router.get("/sectors", getSectors);
router.put("/sector/:id", protect, restrictTo("admin", "super admin"), updateSector);
router.delete("/sector/:id", protect, deleteSector);

//Admins Gestion routes
router.post("/new-admin", protect, restrictTo('super admin'), addAdmin);
router.get("/admins", protect, restrictTo("admin", "super admin"), getAdmins);
router.delete("/admin/:id", protect, restrictTo('super admin'), deleteAdmin);
router.get("/admin-access",  protect,  restrictTo("admin", "super admin"),  checkAdminAccess);

//User Gestion routes
router.get("/user", protect, getUsersInfos);
router.get("/users", protect, getUsers);
router.get(  "/users/:id",  protect,  restrictTo("admin", "super admin"),  getUsersByID);
router.delete("/user/:id", protect, deleteUser);

//Abonnement des utilisateurs
router.post("/abonnement", protect, restrictTo("admin", "super admin"), assignSubscription);
router.put("/abonnement/:id", protect, restrictTo("admin", "super admin"), updateSubscription);
router.delete("/abonnement/:id", protect, restrictTo("admin", "super admin"), deleteSubscription);
router.get("/abonnements", getSubscriptions);
router.get("/abo/:id", protect, restrictTo("admin", "super admin"), getSingleSubscriptions);

//Messages
router.post("/msg", addMessage);
router.get("/messages", protect, restrictTo("admin", "super admin"), getMessages);
router.delete("/message/:id", protect, restrictTo("admin", "super admin"),deleteMessage);
router.put("/message/:id", protect, restrictTo("admin", "super admin"),markAsSeenMessage);

//Mettre à jour profile & password
router.post("/update-password", protect, updatePassword);
router.post("/update-paswd/:id", protect, updatePasswordAdmin);
router.post("/update-admin-info/:id", protect, updateAdminInfo);
router.post("/update-personal-info", protect, updatePersonalInfo);

//Récupérer les entreprises
router.get("/entreprises", getEntreprises);
//Récupérer les entreprises
router.get("/journals", getJournals);

// les state de la page d'accueil de l'admin
router.get("/stats", getStats);

export default router;
