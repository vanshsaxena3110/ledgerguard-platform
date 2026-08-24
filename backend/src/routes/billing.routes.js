import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getBilling } from "../controllers/billing.controller.js";

const router = express.Router();

router.get("/", protect, getBilling);

export default router