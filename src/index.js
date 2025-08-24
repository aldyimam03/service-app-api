import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { testConnection, seedAdmin } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import scheduleRoutes from "./routes/schedules.js";
import { errorResponse } from "./utils/responses.js";

dotenv.config();

const app = express();
const localhost = "localhost";
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/schedules", scheduleRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Vehicle Service Booking API",
    endpoints: {
      auth: "/api/auth",
      bookings: "/api/bookings",
      schedules: "/api/schedules",
    },
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, null, 404);
});

const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("Database connection failed. Exiting...");
      process.exit(1);
    }
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`
        ================================================
        ||  Server running on: http://${localhost}:${PORT}  ||
        ================================================
        `);
      console.log(
        "============================================================================"
      );
      console.log("📋 Available endpoints:");
      console.log("   GET  /                           - API info");
      console.log(
        "============================================================================"
      );
      console.log("   POST /api/auth/login             - Dealer login");
      console.log(
        "   GET  /api/auth/profile           - Get dealer profile (protected)"
      );
      console.log(
        "   POST /api/auth/logout            - Dealer logout (protected)"
      );
      console.log(
        "============================================================================"
      );
      console.log(
        "   GET  /api/schedules              - Get all schedules (protected)"
      );
      console.log(
        "   POST /api/schedules              - Create schedule (protected)"
      );
      console.log(
        "   PUT  /api/schedules/:id/quota    - Update schedule quota (protected)"
      );
      console.log(
        "   DELETE /api/schedules/:id        - Delete schedule (protected)"
      );
      console.log(
        "============================================================================"
      );
      console.log(
        "   GET  /api/bookings               - Get all bookings (protected)"
      );
      console.log("   POST /api/bookings               - Create booking");
      console.log(
        "   GET  /api/bookings/check         - Check bookings by phone"
      );
      console.log(
        "   GET  /api/bookings/statistics    - Get booking statistics (protected)"
      );
      console.log(
        "   GET  /api/bookings/status/:status- Get bookings by status (protected)"
      );
      console.log(
        "   GET  /api/bookings/:id           - Get booking by ID (protected)"
      );
      console.log(
        "   PUT  /api/bookings/:id/status    - Update booking status (protected)"
      );
      console.log(
        "============================================================================"
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};
console.log("DB Name from env:", process.env.DB_NAME);

startServer();

export default app;
