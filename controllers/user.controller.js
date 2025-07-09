import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ========================= REGISTER ========================= //
export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Step 1: Validate input
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "Fullname, email, and password are required",
        success: false,
      });
    }

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Step 3: Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Save new user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Step 5: Send success response (without password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ========================= LOGIN ========================= //
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Step 2: Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "Incorrect email or password,Kindly register first",
        success: false,
      });
    }

    // Step 3: Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Step 4: Generate JWT token
    const tokenData = { id: existingUser._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {    //jwt.sign is used to create a token
      expiresIn: "30d",
    });

    // Step 5: Set token as HTTP-only cookie and send response
    return res.status(200)
      .cookie("token", token, {               
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
        secure: true, // set to false if not using HTTPS in dev
      })
      .json({
        message: `Welcome back ${existingUser.fullname}`,
        user: {
          id: existingUser._id,
          fullname: existingUser.fullname,
          email: existingUser.email,
        },
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ========================= LOGOUT ========================= //
export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    return res.status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

