import db from "../config/database.js";

class Booking {
  static async create(bookingData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const {
        name,
        phone_no,
        vehicle_type,
        license_plate,
        vehicle_problem,
        service_schedule_id,
        service_time,
        service_status_id = 1,
      } = bookingData;

      const [schedules] = await connection.execute(
        "SELECT id, quota FROM service_schedules WHERE id = ? FOR UPDATE",
        [service_schedule_id]
      );

      if (schedules.length === 0) {
        throw new Error("Schedule not found for given ID");
      }

      const schedule = schedules[0];

      if (schedule.quota <= 0) {
        throw new Error("No available quota for this schedule");
      }

      const [result] = await connection.execute(
        `INSERT INTO service_bookings 
        (name, phone_no, vehicle_type, license_plate, vehicle_problem, service_schedule_id, service_time, service_status_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          phone_no,
          vehicle_type,
          license_plate,
          vehicle_problem,
          service_schedule_id,
          service_time,
          service_status_id,
        ]
      );

      await connection.execute(
        "UPDATE service_schedules SET quota = quota - 1 WHERE id = ?",
        [service_schedule_id]
      );

      await connection.commit();

      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw new Error("Database error (create booking): " + error.message);
    } finally {
      connection.release();
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          sb.id, sb.name, sb.phone_no, sb.vehicle_type, sb.license_plate, sb.vehicle_problem,
          sb.service_time, DATE_FORMAT(ss.schedule_date, '%Y-%m-%d') AS schedule_date, st.name AS status,
          sb.created_at, sb.updated_at
        FROM service_bookings sb
        JOIN service_schedules ss ON sb.service_schedule_id = ss.id
        JOIN service_statuses st ON sb.service_status_id = st.id
        ORDER BY ss.schedule_date ASC, sb.service_time ASC
      `);
      return rows;
    } catch (error) {
      throw new Error("Database error (getAll): " + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        `
        SELECT 
          sb.id, sb.name, sb.phone_no, sb.vehicle_type, sb.license_plate, sb.vehicle_problem,
          sb.service_time, DATE_FORMAT(ss.schedule_date, '%Y-%m-%d') AS schedule_date, st.name AS status,
          sb.created_at, sb.updated_at
        FROM service_bookings sb
        JOIN service_schedules ss ON sb.service_schedule_id = ss.id
        JOIN service_statuses st ON sb.service_status_id = st.id
        WHERE sb.id = ?
      `,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error("Database error (findById): " + error.message);
    }
  }

  static async findByPhone(phoneNo) {
    try {
      const [rows] = await db.execute(
        `
        SELECT 
          sb.id, sb.name, sb.phone_no, sb.vehicle_type, sb.license_plate, sb.vehicle_problem,
          sb.service_time, DATE_FORMAT(ss.schedule_date, '%Y-%m-%d') AS schedule_date, st.name AS status,
          sb.created_at, sb.updated_at
        FROM service_bookings sb
        JOIN service_schedules ss ON sb.service_schedule_id = ss.id
        JOIN service_statuses st ON sb.service_status_id = st.id
        WHERE sb.phone_no = ?
        ORDER BY ss.schedule_date DESC, sb.service_time DESC
      `,
        [phoneNo]
      );
      return rows;
    } catch (error) {
      throw new Error("Database error (findByPhone): " + error.message);
    }
  }

  static async updateStatus(id, newStatusId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [bookings] = await connection.execute(
        "SELECT id, service_schedule_id, service_status_id FROM service_bookings WHERE id = ?",
        [id]
      );

      if (bookings.length === 0) {
        throw new Error("Booking not found");
      }

      const booking = bookings[0];
      const oldStatusId = booking.service_status_id;

      if (oldStatusId === newStatusId) {
        await connection.commit();
        return true;
      }

      await connection.execute(
        "UPDATE service_bookings SET service_status_id = ? WHERE id = ?",
        [newStatusId, id]
      );

      if (newStatusId === 2 && oldStatusId !== 2) {
        await connection.execute(
          "UPDATE service_schedules SET quota = quota + 1 WHERE id = ?",
          [booking.service_schedule_id]
        );
      } else if (oldStatusId === 2 && newStatusId !== 2) {
        const [schedules] = await connection.execute(
          "SELECT quota FROM service_schedules WHERE id = ? FOR UPDATE",
          [booking.service_schedule_id]
        );

        if (schedules.length > 0 && schedules[0].quota > 0) {
          await connection.execute(
            "UPDATE service_schedules SET quota = quota - 1 WHERE id = ?",
            [booking.service_schedule_id]
          );
        } else {
          throw new Error("Cannot booking, schedule is now full.");
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error("Database error (updateStatus): " + error.message);
    } finally {
      connection.release();
    }
  }

  static async findByStatus(statusId) {
    try {
      const [rows] = await db.execute(
        `
      SELECT 
        sb.id, sb.name, sb.phone_no, sb.vehicle_type, sb.license_plate, sb.vehicle_problem,
        sb.service_time, DATE_FORMAT(ss.schedule_date, '%Y-%m-%d') AS schedule_date, 
        sb.service_status_id, st.name AS status_name,
        sb.created_at, sb.updated_at
      FROM service_bookings sb
      JOIN service_schedules ss ON sb.service_schedule_id = ss.id
      JOIN service_statuses st ON sb.service_status_id = st.id
      WHERE sb.service_status_id = ?
      ORDER BY ss.schedule_date ASC, sb.service_time ASC
    `,
        [statusId]
      );
      return rows;
    } catch (error) {
      throw new Error("Database error (findByStatus): " + error.message);
    }
  }

  static async getStatistics() {
    try {
      const [rows] = await db.execute(`
        SELECT st.name as status, COUNT(*) as count
        FROM service_bookings sb
        JOIN service_statuses st ON sb.service_status_id = st.id
        GROUP BY st.name
      `);

      const stats = { total: 0 };
      rows.forEach((row) => {
        stats[row.status] = row.count;
        stats.total += row.count;
      });
      return stats;
    } catch (error) {
      throw new Error("Database error (getStatistics): " + error.message);
    }
  }
}

export default Booking;
