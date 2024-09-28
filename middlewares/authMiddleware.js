import jwt from "jsonwebtoken";
import { promisify } from "util";
// import { JWT_SECRET } from "../config.js";
import dotenv from 'dotenv';
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET;
import { User } from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: token,
    });
  }

  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message: "L'utilisateur n'existe pas!",
    });
  }

  req.user = currentUser;
  next();
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Vous n'étes pas autoriser a acceder à cette section",
      });
    }
    next();
  };
};
