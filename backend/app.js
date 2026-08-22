import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes.js"
import transactionRoutes from "./src/routes/transaction.routes.js"
import billingRoutes from "./src/routes/billing.routes.js";
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth" ,authRoutes)
app.use("/api/transactions",transactionRoutes)
app.use("/api/billing",billingRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "LedgerGuard API is running",
  });
});

export default app;