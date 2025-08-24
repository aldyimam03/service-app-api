import { testConnection } from "../config/database.js";
import { seedSchedules } from "./scheduleSeeder.js";
import { seedBookings } from "./BookingSeeder.js";

const runSeeders = async () => {
  try {
    const connection = await testConnection();
    if (!connection) {
      console.error("Database connection failed. Exiting...");
      process.exit(1);
    }
    const schedule = await seedSchedules();
    console.log("===============================================");
    await seedBookings(schedule);
    console.log("Seeders executed successfully.");
    process.exit(0);
  } catch (error) {
    throw new Error("Failed to run seeders: " + error.message);
  }
};

runSeeders();