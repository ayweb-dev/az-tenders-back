import dotenv from "dotenv";
import express from "express";
dotenv.config();
export const PORT = process.env.PORT;
export const mongoDBURL = process.env.MONGODB_URL;
// import { PORT, mongoDBURL } from "./config.js";
import cors from "cors";
import session from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import "./cronJobs/subscriptionExpiration.js"; // Importer la tâche planifiée de l'expiration des abonnenements
import "./middlewares/passport.js"; //pour la connexion depuis google
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// cors middleware
app.use(
  cors({
    //origin: "http://localhost:5173",
    // origin: "http://localhost:4173",
    origin: ["https://az-tenders.com","https://api.az-tenders.com"],
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH", "HEAD", "OPTION"],
  })
);

// CSP directives (pour gerer les sources de upload et download)
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    reportOnly: true, // Active le mode rapport
    directives: {
      // Autorise le chargement des scripts depuis ces sources
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://apis.google.com",
        "https://cdn.jsdelivr.net",
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"], // Autorise les images locales et Cloudinary
      connectSrc: ["'self'", "https://your-api.com"], // API de backend
      frameSrc: ["https://accounts.google.com"], // Si vous utilisez Google OAuth
      objectSrc: ["'none'"], // Empêche les objets non sécurisés comme Flash ou Java
    },
    reportUri: "/csp-violation-report-endpoint",
  })
);
app.use((req, res, next) => {
  req.setTimeout(300000); // Timeout de 5 minutes (300000 ms)
  next();
});

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening to port :${PORT}`);
    });
    console.log("App connected to DataBase");
  })
  .catch((error) => {
    console.log(error);
  });
