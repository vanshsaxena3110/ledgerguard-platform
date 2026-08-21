import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createTransaction, updateTransaction } from "../controllers/transaction.controller.js";
import { getTransactions } from "../controllers/transaction.controller.js";
import { deleteTransaction } from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", protect, createTransaction);
router.get("/", protect, getTransactions);
router.delete("/:id", protect, deleteTransaction);
router.put("/:id",protect,updateTransaction)


export default router;