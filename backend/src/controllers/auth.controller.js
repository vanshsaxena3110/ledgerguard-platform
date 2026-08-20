import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";

const generateToken = (userId, companyId) => {
  return jwt.sign(
    {
      userId,
      companyId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const signup = async (req, res) => {
  try {
    const { name, password, companyName } = req.body;

    if (!name || !password || !companyName) {
      return res.status(400).json({
        message: "Name, password and company name are required",
      });
    }

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    let company = await Company.findOne({ name: companyName });

    if (!company) {
      company = await Company.create({
        name: companyName,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashedPassword,
      company: company._id,
      role: "admin",
    });

    const token = generateToken(user._id, company._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        company: company.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        message: "Name and password are required",
      });
    }

    const user = await User.findOne({ name }).populate("company");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id, user.company._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        company: user.company.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");

  res.json({
    message: "Logout successful",
  });
};