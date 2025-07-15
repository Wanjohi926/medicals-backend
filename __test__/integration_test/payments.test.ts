import request from "supertest";
import app from "../../src/index";
import db from "../../src/drizzle/db";
import { UsersTable, DoctorsTable, AppointmentsTable, PaymentsTable } from "../../src/drizzle/schema";
import { eq } from "drizzle-orm";

describe("Payment Integration Test (Real DB)", () => {
  let userId: number;
  let doctorId: number;
  let appointmentId: number;
  let paymentId: number;

  beforeAll(async () => {
    // Insert user
    const [user] = await db.insert(UsersTable).values({
      first_name: "Jane",
      last_name: "Doe",
      email: "paymentuser@example.com",
      password: "hashed_password",
      contact_phone: "0712345678",
      address: "Testville",
      role: "user",
      is_verified: true,
    }).returning({ user_id: UsersTable.user_id });
    userId = user.user_id;

    // Insert doctor
    const [doctor] = await db.insert(DoctorsTable).values({
      first_name: "Dr",
      last_name: "Smith",
      specialization: "Cardiology",
      email: "drsmith@example.com",
      password: "hashed_password",
      contact_phone: "0700000000",
      is_verified: true,
    }).returning({ doctor_id: DoctorsTable.doctor_id });
    doctorId = doctor.doctor_id;

    // Insert appointment
    const [appointment] = await db.insert(AppointmentsTable).values({
      user_id: userId,
      doctor_id: doctorId,
      appointment_date: "2025-07-20",
      time_slot: "10:00 AM - 11:00 AM",
      total_amount: 5000,
    }).returning({ appointment_id: AppointmentsTable.appointment_id });
    appointmentId = appointment.appointment_id;
  });

  afterAll(async () => {
    if (paymentId) await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, paymentId));
    await db.delete(AppointmentsTable).where(eq(AppointmentsTable.appointment_id, appointmentId));
    await db.delete(DoctorsTable).where(eq(DoctorsTable.doctor_id, doctorId));
    await db.delete(UsersTable).where(eq(UsersTable.user_id, userId));
  });

  test("POST /payment - should create a new payment", async () => {
    const res = await request(app).post("/payment").send({
      appointment_id: appointmentId,
      amount: 5000,
      transaction_id: "TXN-10001",
      payment_status: "Completed",
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("appointment_id");
    expect(res.body.data).toHaveProperty("payment_id");

    paymentId = res.body.data.payment_id;
  });

  test("GET /payments - should return all payments", async () => {
    const res = await request(app).get("/payments");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data));
    expect(res.body.data.find((p: any) => p.payment_id === paymentId)).toBeTruthy();
  });

  test("GET /payment/:id - should return payment by ID", async () => {
    const res = await request(app).get(`/payment/${paymentId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.payment_id).toBe(paymentId);
  });

  test("GET /payment/:id - invalid ID", async () => {
    const res = await request(app).get("/payment/invalid");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  test("PUT /payment/:id - should update payment status", async () => {
    const res = await request(app).put(`/payment/${paymentId}`).send({
      payment_status: "Refunded",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.payment_status).toBe("Refunded");
  });

  test("PUT /payment/:id - invalid ID", async () => {
    const res = await request(app).put("/payment/invalid").send({ payment_status: "Pending" });
    expect(res.status).toBe(500); 
  });

  test("DELETE /payment/:id - should delete payment", async () => {
    const res = await request(app).delete(`/payment/${paymentId}`);
    expect(res.status).toBe(204);
  });

  test("DELETE /payment/:id - should handle not found", async () => {
    const res = await request(app).delete(`/payment/${paymentId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Payment not found");
  });

  test("DELETE /payment/:id - invalid ID", async () => {
    const res = await request(app).delete("/payment/invalid");
    expect(res.status).toBe(500); 
  });
});
