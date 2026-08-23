import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { tenant } from "../middleware/tenant.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protect, tenant, getDashboard);

export default router;