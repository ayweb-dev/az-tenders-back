import axios from "axios";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import passport from "passport";
import "../middlewares/passport.js";
import { User } from "../models/userModel.js";
dotenv.config();
// import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const signup = async (req, res) => {
  try {
    if (
      !req.body.nom ||
      !req.body.prenom ||
      !req.body.tel ||
      !req.body.wilaya ||
      !req.body.email ||
      !req.body.password ||
      !req.body.passwordConfirm
    ) {
      return res.status(400).send({
        message: "Champ manquant !",
      });
    }

    const { recaptchaToken } = req.body;
    // Vérifiez la réponse reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const response = await axios.post(verificationUrl);
    const { success } = response.data;

    if (!success) {
      return res.status(400).json({
        status: "fail",
        message: "Échec de la vérification reCAPTCHA",
      });
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Vérifiez le mot de passe de confirmation",
      });
    }
    const newUser = await User.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      tel: req.body.tel,
      wilaya: req.body.wilaya,
      email: req.body.email,
      password: req.body.password,
    });

    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token, // c normal ?
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Veuillez completer les champs!",
    });
  }

  // Vérifiez la réponse reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  const response = await axios.post(verificationUrl);
  const { success } = response.data;

  if (!success) {
    return res.status(400).json({
      status: "fail",
      message: "Échec de la vérification reCAPTCHA",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "email ou mot de passe incorrecte",
    });
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token, // c'est normal ?
    user,
  });
};

export const logout = (req, res) => {
  // Supprimer le token côté client
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// conncetion avec Google
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Fonction de callback après l'authentification Google
export const googleAuthCallback = (req, res) => {
  // Vérifiez si l'utilisateur a complété son profil
  if (!req.user.tel || !req.user.wilaya) {
    return res.redirect(
      `http://az-tenders/CompleteProfile?userId=${req.user._id}`
    );
  }

  const token = signToken(req.user._id);
  res.redirect(`http://az-tenders/UserHome?token=${token}`);
};

// // Fonction pour afficher le formulaire de complétion du profil
// export const completeProfile = (req, res) => {
//   //il sera modifié !
//   res.send(`
//     <form action="/user/update-profile" method="POST">
//       <label for="tel">Téléphone:</label>
//       <input type="text" id="tel" name="tel" required><br>
//       <label for="wilaya">Wilaya:</label>
//       <input type="text" id="wilaya" name="wilaya" required><br>
//       <button type="submit">Compléter le profil</button>
//     </form>
//   `);
// };
