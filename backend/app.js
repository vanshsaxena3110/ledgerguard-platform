import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes.js"
import transactionRoutes from "./src/routes/transaction.routes.js"
import billingRoutes from "./src/routes/billing.routes.js";
import dashbaordRoutes from "./src/routes/dashboard.routes.js"
import { errorHandler } from "./src/middleware/error.middleware.js";

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests, please try again later",
  },
});

app.use(limiter);

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
app.use("/api/dashboard",dashbaordRoutes)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    message: "LedgerGuard API is running",
  });
});

export default app;