import request from "supertest";
import app from "../../src/index";
import db from "../../src/drizzle/db";
import { UsersTable, DoctorsTable, AppointmentsTable, PrescriptionsTable } from "../../src/drizzle/schema";
import { eq } from "drizzle-orm";

describe("Prescription Integration Test (Real DB)", () => {
  let userId: number;
  let doctorId: number;
  let appointmentId: number;
  let prescriptionId: number;

  beforeAll(async () => {
    const [user] = await db.insert(UsersTable).values({
      first_name: "John",
      last_name: "Doe",
      email: "prescuser@example.com",
      password: "hashed",
      contact_phone: "0700000000",
      address: "Testville",
      is_verified: true,
    }).returning({ user_id: UsersTable.user_id });
    userId = user.user_id;

    const [doctor] = await db.insert(DoctorsTable).values({
      first_name: "Dr",
      last_name: "House",
      specialization: "General",
      email: "presdoc@example.com",
      password: "hashed",
      contact_phone: "0711223344",
      is_verified: true,
    }).returning({ doctor_id: DoctorsTable.doctor_id });
    doctorId = doctor.doctor_id;

    const [appointment] = await db.insert(AppointmentsTable).values({
      user_id: userId,
      doctor_id: doctorId,
      appointment_date: "2025-07-20",
      time_slot: "09:00 AM - 10:00 AM",
      total_amount: 4000
    }).returning({ appointment_id: AppointmentsTable.appointment_id });
    appointmentId = appointment.appointment_id;
  });

  afterAll(async () => {
    if (prescriptionId) await db.delete(PrescriptionsTable).where(eq(PrescriptionsTable.prescription_id, prescriptionId));
    await db.delete(AppointmentsTable).where(eq(AppointmentsTable.appointment_id, appointmentId));
    await db.delete(DoctorsTable).where(eq(DoctorsTable.doctor_id, doctorId));
    await db.delete(UsersTable).where(eq(UsersTable.user_id, userId));
  });

  test("POST /prescription - should create a prescription", async () => {
    const res = await request(app).post("/prescription").send({
      appointment_id: appointmentId,
      doctor_id: doctorId,
      patient_id: userId,
      notes: "Take 1 pill daily"
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("prescription_id");
    prescriptionId = res.body.data.prescription_id;
  });

  test("GET /prescriptions - should return all prescriptions", async () => {
    const res = await request(app).get("/prescriptions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /prescription/:id - should return a specific prescription", async () => {
    const res = await request(app).get(`/prescription/${prescriptionId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.prescription_id).toBe(prescriptionId);
  });

  test("PUT /prescription/:id - should update a prescription", async () => {
    const res = await request(app).put(`/prescription/${prescriptionId}`).send({
      notes: "Updated note"
    });
    expect(res.status).toBe(200);
    expect(res.body.data.notes).toBe("Updated note");
  });

  test("DELETE /prescription/:id - should delete a prescription", async () => {
    const res = await request(app).delete(`/prescription/${prescriptionId}`);
    expect(res.status).toBe(204);
  });

  test("GET /prescription/:id - should return 404 after deletion", async () => {
    const res = await request(app).get(`/prescription/${prescriptionId}`);
    expect(res.status).toBe(404);
  });
});
