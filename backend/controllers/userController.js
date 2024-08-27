import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { sendPasswordReset, sendVerificationEmail } from "../mailtrap/email.js";

export const Signup = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      res.status(400);
      throw new Error("User already exist");
    }
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = await User.create({
      username,
      email,
      password,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await sendVerificationEmail(newUser.email, verificationToken);

      res.status(201).json({
        ...newUser._doc,
        password: undefined,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.log(`Signup Error ${error}`);
    next(error);
  }
});

export const Login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(user._id, res);

      res.status(201).json({
        _id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.log(`Login Error ${error}`);
    next(error);
  }
});

export const Logout = asyncHandler(async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "successfully logout" });
  } catch (error) {
    console.log(`Logout Error ${error}`);
    next(error);
  }
});

export const checkAuth = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(`Check Auth ${error}`);
    next(error);
  }
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired verification code");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    // await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      data: { ...user._doc, password: undefined },
      message: "Email Verified",
    });
  } catch (error) {
    console.log(`Email Verification Error ${error}`);
    next(error);
  }
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    sendPasswordReset(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.log(`Email Verification Error ${error}`);
    next(error);
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(`Email Verification Error ${error}`);
    next(error);
  }
});
