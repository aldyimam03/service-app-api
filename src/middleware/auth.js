import { verifyToken } from "../config/jwt.js";
import { unauthorizedResponse } from "../utils/responses.js";
import Dealer from "../models/Dealer.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return unauthorizedResponse(res, "Token not found");

    const decoded = verifyToken(token);

    const dealer = await Dealer.findById(decoded.dealerId);
    if (!dealer) {
      return unauthorizedResponse(res, "Dealer not found");
    }

    req.dealer = dealer;

    next();
  } catch (error) {
    if (error.message === "Invalid token") {
      return unauthorizedResponse(res, "Invalid token or expired token");
    } else {
      return unauthorizedResponse(res, "Token verification failed");
    }
  }
};

export const isAdmin = (req, res, next) => {
  if (req.dealer && req.dealer.username === "admin") {
    next(); 
  } else {
    return unauthorizedResponse(res, "Access denied: Admin only");
  }
};

