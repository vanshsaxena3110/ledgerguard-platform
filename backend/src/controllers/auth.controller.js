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
    const { name, password, companyName } = req.body;

    if (!name || !password || !companyName) {
      return res.status(400).json({
        message: "Company name, username and password are required",
      });
    }

    // Find company
    const company = await Company.findOne({
      name: companyName,
    });

    if (!company) {
      return res.status(401).json({
        message: "Company not found",
      });
    }

    // Find user belonging to this company
    const user = await User.findOne({
      name,
      company: company._id,
    }).populate("company");

    if (!user) {
      return res.status(401).json({
        message: "User not found in this company",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = generateToken(
      user._id,
      user.company._id
    );

    res.json({
      message: "Login successful",
      token,
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

export const updateProfile = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ message: "Name is required" });

    const existingUser = await User.findOne({ name, _id: { $ne: req.user._id } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    ).select("-password").populate("company");

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ message: "Company name is required" });

    const existingCompany = await Company.findOne({ name, _id: { $ne: req.companyId } });
    if (existingCompany) return res.status(400).json({ message: "Company already exists" });

    const company = await Company.findByIdAndUpdate(
      req.companyId,
      { name },
      { new: true, runValidators: true }
    );

    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company updated successfully", company });
  } catch (error) {
    console.error("Company update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
