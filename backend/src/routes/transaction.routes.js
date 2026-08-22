import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createTransaction, updateTransaction } from "../controllers/transaction.controller.js";
import { getTransactions } from "../controllers/transaction.controller.js";
import { deleteTransaction } from "../controllers/transaction.controller.js";
import { tenant } from "../middleware/tenant.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, tenant, createTransaction);
router.get("/", protect, tenant, getTransactions);
router.delete("/:id", protect, tenant, allowRoles("admin"),deleteTransaction);
router.put("/:id",protect, tenant ,allowRoles("admin"),updateTransaction)


export default router;