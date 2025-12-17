import { findUserByEmail, verifyPassword } from "../services/user.service.js";
import { asyncHandler } from "../utils/acyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "User doesn't exists");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = generateAccessToken(user.id);

  const userData = {
    id: user.id,
    email: user.email,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userData,
        accessToken,
      },
      "User logged in successfully"
    )
  );
});
