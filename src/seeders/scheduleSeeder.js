import Schedule from "../models/Schedule.js";

export const seedSchedules = async () => {
  try {
    const schedules = [];
    for (let i = 1; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const quota = Math.floor(Math.random() * 20) + 1;
      const formattedDate = date.toISOString().split("T")[0];

      const existing = await Schedule.findOneByDate(formattedDate);

      if (existing) {
        console.log(`Schedule already exists for ${formattedDate}, skipped.`);
        schedules.push(existing);
        continue;
      }

      const newScheduleId = await Schedule.create({
        schedule_date: formattedDate,
        quota: quota,
      });

      const newSchedule = await Schedule.findById(newScheduleId);

      console.log(
        `Schedule created with ID: ${newSchedule.id} - Date: ${newSchedule.schedule_date} - (quota: ${newSchedule.quota})`
      );

      schedules.push(newSchedule);
    }

    return schedules;
  } catch (error) {
    throw new Error("Failed to seed schedules: " + error.message);
  }
};

export default seedSchedules;
