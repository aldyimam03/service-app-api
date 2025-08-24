import Dealer from "../models/Dealer.js";
import { generateToken } from "../config/jwt.js";
import {
  successResponse,
  serverErrorResponse,
  badRequestResponse,
} from "../utils/responses.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const dealer = await Dealer.findByUsername(username);
    if (!dealer) {
      return badRequestResponse(res, "Dealer not found");
    }

    const isValidPassword = await Dealer.validatePassword(
      password,
      dealer.password
    );

    if (!isValidPassword) {
      return badRequestResponse(res, "Invalid username or password");
    }

    const token = generateToken({
      dealerId: dealer.id,
      username: dealer.username,
    });

    const responsesData = {
      token,
      dealer: {
        id: dealer.id,
        username: dealer.username,
        name: dealer.name,
        email: dealer.email,
        phone: dealer.phone,
      },
    };
    return successResponse(res, "Login successful", responsesData);
  } catch (error) {
    console.log("Login Error: ", error);
    return serverErrorResponse(res, error.message);
  }
};

export const profile = async (req, res) => {
  try {
    const dealer = req.dealer;

    return successResponse(res, "Dealer profile", {
      dealer: {
        id: dealer.id,
        username: dealer.username,
        name: dealer.name,
        email: dealer.email,
        phone: dealer.phone,
      },
    });
  } catch (error) {
    console.log("Profile Error: ", error);
    return serverErrorResponse(res, "Failed to get dealer profile");
  }
};

export const logout = async (req, res) => {
  try {
    return successResponse(res, "Logout successful");
  } catch (error) {
    console.log("Logout Error: ", error);
    return serverErrorResponse(res, "Failed to logout");
  }
};

export default { login, profile, logout };
