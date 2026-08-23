import "dotenv/config";
import http from "http";
import app from "./app.js";
import { initializeSocket } from "./src/socket/socket.js";
import connectDB from "./src/config/db.js";


const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server)

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`LedgerGuard server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
};

startServer();