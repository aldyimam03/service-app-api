import Booking from "../models/Booking.js";

const dummyUsers = [
  {
    name: "User 1",
    phone_no: "0811111111",
    vehicle_type: "Avanza",
    license_plate: "B1234AA",
    vehicle_problem: "Mesin berisik sekali",
  },
  {
    name: "User 2",
    phone_no: "0822222222",
    vehicle_type: "Xenia",
    license_plate: "B2234BB",
    vehicle_problem: "Rem blong tiba tiba",
  },
  {
    name: "User 3",
    phone_no: "0833333333",
    vehicle_type: "Supra",
    license_plate: "B3234CC",
    vehicle_problem: "Air Conditioner mati",
  },
  {
    name: "User 4",
    phone_no: "0844444444",
    vehicle_type: "Jazz",
    license_plate: "B4234DD",
    vehicle_problem: "Ban gundul semuanya",
  },
  {
    name: "User 5",
    phone_no: "0855555555",
    vehicle_type: "CRV",
    license_plate: "B5234EE",
    vehicle_problem: "Power steering rusak",
  },
  {
    name: "User 6",
    phone_no: "0866666666",
    vehicle_type: "Fortuner",
    license_plate: "B6234FF",
    vehicle_problem: "Shockbreaker bocor",
  },
  {
    name: "User 7",
    phone_no: "0877777777",
    vehicle_type: "Pajero",
    license_plate: "B7234GG",
    vehicle_problem: "Kelistrikan error tiba tiba",
  },
  {
    name: "User 8",
    phone_no: "0888888888",
    vehicle_type: "Yaris",
    license_plate: "B8234HH",
    vehicle_problem: "Kopling cepat aus",
  },
  {
    name: "User 9",
    phone_no: "0899999999",
    vehicle_type: "Innova",
    license_plate: "B9234II",
    vehicle_problem: "Oli bocor ke dalam mesin",
  },
  {
    name: "User 10",
    phone_no: "0810000000",
    vehicle_type: "Civic",
    license_plate: "B1023JJ",
    vehicle_problem: "Radiator panas sekali",
  },
];

export const seedBookings = async (schedules) => {
  try {
    for (let i = 0; i < dummyUsers.length; i++) {
      const user = dummyUsers[i];

      const randomSchedule =
        schedules[Math.floor(Math.random() * schedules.length)];

      const randomHour = Math.floor(Math.random() * 9) + 8;
      const randomMinute = Math.floor(Math.random() * 60);
      const serviceTime = `${String(randomHour).padStart(2, "0")}:${String(
        randomMinute
      ).padStart(2, "0")}`;

      await Booking.create({
        ...user,
        service_schedule_id: randomSchedule.id,
        service_time: serviceTime,
      });

      console.log(
        `Booking created for ${user.name} at schedule ${randomSchedule.schedule_date} (${serviceTime})`
      );
    }
  } catch (error) {
    console.error("Failed to seed bookings:", error.message);
  }
};
