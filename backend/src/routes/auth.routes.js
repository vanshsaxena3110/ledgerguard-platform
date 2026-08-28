import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  updateCompany,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, async (req, res) => {
  await req.user.populate("company");
  res.json({
    user: req.user,
    companyId: req.companyId,
  });
});
router.put("/profile", protect, updateProfile);
router.put("/company", protect, updateCompany);

export default router;
