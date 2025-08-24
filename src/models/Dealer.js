import db from "../config/database.js";
import bcrypt from "bcryptjs";

class Dealer {
  static async findByUsername(username) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM dealers WHERE username = ?",
        [username]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Database error" + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        "SELECT id, username, name, address, created_at FROM dealers WHERE id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    try {
      const password = "admin123";
      const hash = await bcrypt.hash(password, 12);
      console.log(hash);
      return bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error("Password validation error: " + error.message);
    }
  }

  static async create(dealerData) {
    try {
      const { name, username, password, address } = dealerData;
      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await db.execute(
        "INSERT INTO dealers (name, username, password, address) VALUES (?, ?, ?, ?)",
        [name, username, hashedPassword, address]
      );
      return result.insertId;
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute(
        "SELECT id, username, name, address, created_at FROM dealers ORDER BY created_at DESC"
      );
      return rows;
    } catch (error) {
      throw new Error("Database error: " + error.message);
      
    }
  }
}

export default Dealer;
