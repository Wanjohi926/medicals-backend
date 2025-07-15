import db from "./db";
import {
  UsersTable, DoctorsTable, AppointmentsTable, PrescriptionsTable, PaymentsTable, ComplaintsTable, TIUser, TIDoctor, TIAppointment, TIPrescription, TIPayment, TIComplaint,
} from "./schema";

console.log("Seeding started...");

async function seed() {
  try {
    await db.delete(PrescriptionsTable);
    await db.delete(PaymentsTable);
    await db.delete(ComplaintsTable);
    await db.delete(AppointmentsTable);
    await db.delete(DoctorsTable);
    await db.delete(UsersTable);

    // Users
    const users: TIUser[] = [
      { first_name: "Alice", last_name: "Smith", email: "alice@example.com", password: "5673924", role: "user" },
      { first_name: "Bob", last_name: "Jones", email: "bob@example.com", password: "237943", role: "user" },
      { first_name: "Carol", last_name: "White", email: "carol@example.com", password: "1137644", role: "user" },
      { first_name: "Dave", last_name: "Brown", email: "dave@example.com", password: "978634", role: "user" },
      { first_name: "Eve", last_name: "Davis", email: "eve@example.com", password: "1237685", role: "admin" },
    ];
    const insertedUsers = await db.insert(UsersTable).values(users).returning();

    // Doctors
const doctors: TIDoctor[] = [
  { first_name: "Greg",  last_name: "House",  specialization: "Diagnostics",  email: "greg.house@hospital.com",  password: "12345678", contact_phone: "0712345677", available_days: "Mon,Tue,Thu" },
  { first_name: "Sarah", last_name: "Lee",    specialization: "Cardiology",   email: "sarah.lee@hospital.com",   password: "21324354", contact_phone: "0797656432", available_days: "Mon,Wed,Fri" },
  { first_name: "Mike",  last_name: "Miller", specialization: "Neurology",    email: "mike.miller@hospital.com", password: "43215678", contact_phone: "0743667788", available_days: "Tue,Thu" },
  { first_name: "Nina",  last_name: "Park",   specialization: "Dermatology",  email: "nina.park@hospital.com",   password: "87654321", contact_phone: "0710754004", available_days: "Mon,Fri" },
  { first_name: "Alex",  last_name: "Jones",  specialization: "Pediatrics",   email: "alex.jones@hospital.com",  password: "56784321", contact_phone: "0710097855", available_days: "Wed,Thu" }
];
const insertedDoctors = await db.insert(DoctorsTable).values(doctors).returning();

const today = new Date().toISOString().split("T")[0];


    // Appointments
    const appointments: TIAppointment[] = [
      { user_id: insertedUsers[0].user_id, doctor_id: insertedDoctors[0].doctor_id, appointment_date: today, time_slot: "09:00 AM" },
      { user_id: insertedUsers[1].user_id, doctor_id: insertedDoctors[1].doctor_id, appointment_date: today, time_slot: "10:00 AM" },
      { user_id: insertedUsers[2].user_id, doctor_id: insertedDoctors[2].doctor_id, appointment_date: today, time_slot: "11:00 AM" },
      { user_id: insertedUsers[0].user_id, doctor_id: insertedDoctors[3].doctor_id, appointment_date: today, time_slot: "02:00 PM" },
      { user_id: insertedUsers[1].user_id, doctor_id: insertedDoctors[4].doctor_id, appointment_date: today, time_slot: "03:00 PM" },
    ];
    const insertedAppointments = await db.insert(AppointmentsTable).values(appointments).returning();

    // Prescriptions
    const prescriptions: TIPrescription[] = [
      { appointment_id: insertedAppointments[0].appointment_id, doctor_id: insertedDoctors[0].doctor_id, patient_id: insertedUsers[0].user_id, notes: "Take aspirin" },
      { appointment_id: insertedAppointments[1].appointment_id, doctor_id: insertedDoctors[1].doctor_id, patient_id: insertedUsers[1].user_id, notes: "Drink water" },
      { appointment_id: insertedAppointments[2].appointment_id, doctor_id: insertedDoctors[2].doctor_id, patient_id: insertedUsers[2].user_id, notes: "MRI recommended" },
      { appointment_id: insertedAppointments[3].appointment_id, doctor_id: insertedDoctors[3].doctor_id, patient_id: insertedUsers[0].user_id, notes: "Use cream" },
      { appointment_id: insertedAppointments[4].appointment_id, doctor_id: insertedDoctors[4].doctor_id, patient_id: insertedUsers[1].user_id, notes: "Flu shot" },
    ];
    await db.insert(PrescriptionsTable).values(prescriptions);

    // Payments
    const payments: TIPayment[] = [
      { appointment_id: insertedAppointments[0].appointment_id, amount: 1000, transaction_id: "TX001" },
      { appointment_id: insertedAppointments[1].appointment_id, amount: 1500, transaction_id: "TX002" },
      { appointment_id: insertedAppointments[2].appointment_id, amount: 2000, transaction_id: "TX003" },
      { appointment_id: insertedAppointments[3].appointment_id, amount: 1200, transaction_id: "TX004" },
      { appointment_id: insertedAppointments[4].appointment_id, amount: 1800, transaction_id: "TX005" },
    ];
    await db.insert(PaymentsTable).values(payments);

    // Complaints
    const complaints: TIComplaint[] = [
      { user_id: insertedUsers[0].user_id, related_appointment_id: insertedAppointments[0].appointment_id, subject: "Long wait", description: "Waited 2 hours." },
      { user_id: insertedUsers[1].user_id, related_appointment_id: insertedAppointments[1].appointment_id, subject: "Doctor was rude", description: "Unprofessional behavior." },
      { user_id: insertedUsers[2].user_id, related_appointment_id: insertedAppointments[2].appointment_id, subject: "Incorrect prescription", description: "Allergic to meds." },
      { user_id: insertedUsers[0].user_id, related_appointment_id: insertedAppointments[3].appointment_id, subject: "Overcharged", description: "Charged extra." },
      { user_id: insertedUsers[1].user_id, related_appointment_id: insertedAppointments[4].appointment_id, subject: "Late appointment", description: "Doctor was late." },
    ];
    await db.insert(ComplaintsTable).values(complaints);

    console.log(" Seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error(" Seeding failed:", error);
    process.exit(1);
  }
}

seed();
