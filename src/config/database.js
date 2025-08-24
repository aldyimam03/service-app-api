  import mysql from "mysql2/promise";
  import dotenv from "dotenv";
  import Dealer from "../models/Dealer.js";

  dotenv.config();

  export const dbConfig = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  export const testConnection = async () => {
    try {
      const connection = await dbConfig.getConnection();
      console.log("✅ Database connection successful");
      connection.release();
      return true;
    } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      return false;
    }
  };

  export const seedAdmin = async () => {
    try {
      const existingAdmin = await Dealer.findByUsername("admin");

      if (existingAdmin) {
        console.log("Admin dealer already exists, skipping seed.");
        return;
      }

      await Dealer.create({
        username: "admin",
        name: "Admin Dealer",
        address: "Jl. Admin, Kota Admin",
        password: "admin123",
      });

      console.log("✅ Admin dealer created successfully.");
    } catch (error) {
      console.error("❌ Failed to seed admin dealer:", error.message);
    }
  };

  export default dbConfig;
