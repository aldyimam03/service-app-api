import db from "../config/database.js";

class Schedule {
  static async getAllSchedules() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          id, 
          DATE_FORMAT(schedule_date, '%Y-%m-%d') as schedule_date,
          quota,
          created_at, 
          updated_at
        FROM service_schedules 
        ORDER BY schedule_date ASC
      `);
      return rows;
    } catch (error) {
      throw new Error("Database error (getAllSchedules): " + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        `
        SELECT
          id,
          DATE_FORMAT(schedule_date, '%Y-%m-%d') as schedule_date,
          quota,
          created_at,
          updated_at
        FROM service_schedules
        WHERE id = ?
      `,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Database error (findById): " + error.message);
    }
  }

  static async create(scheduleData) {
    try {
      const { schedule_date, quota } = scheduleData;
      const [result] = await db.execute(
        "INSERT INTO service_schedules (schedule_date, quota) VALUES (?, ?)",
        [schedule_date, quota]
      );
      return result.insertId;
    } catch (error) {
      throw new Error("Database error (create): " + error.message);
    }
  }

  static async updateQuota(id, quota) {
    try {
      const [result] = await db.execute(
        "UPDATE service_schedules SET quota = ? WHERE id = ?",
        [quota, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Database error (updateQuota): " + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        "DELETE FROM service_schedules WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Database error (delete): " + error.message);
    }
  }

  static async findOneByDate(schedule_date) {
    try {
      const [rows] = await db.execute(
        `
      SELECT 
        id, 
        DATE_FORMAT(schedule_date, '%Y-%m-%d') as schedule_date,
        quota,
        created_at, 
        updated_at
      FROM service_schedules
      WHERE schedule_date = ?
      LIMIT 1
      `,
        [String(schedule_date)]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error("Database error (findOneByDate): " + error.message);
    }
  }
}

export default Schedule;
