import request from "supertest";
import app from "../../src/index";
import db from "../../src/drizzle/db";
import { DoctorsTable } from "../../src/drizzle/schema";
import { eq } from "drizzle-orm";

describe("Doctor Integration Test (Real DB)", () => {
  const doctor = {
    first_name: "John",
    last_name: "Doe",
    specialization: "Cardiologist",
    email: "johndoe@example.com",
    password: "SecurePass123",
    contact_phone: "0712345678",
  };

  let doctorId: number;
  let verificationCode: string;
  let token: string;

  afterAll(async () => {
    await db.delete(DoctorsTable).where(eq(DoctorsTable.email, doctor.email));
  });

  test(" POST /doctor - should create doctor", async () => {
    const res = await request(app).post("/doctor").send(doctor);
    expect(res.status).toBe(201);
    expect(res.body.doctor).toHaveProperty("doctor_id");
    expect(res.body.doctor).toHaveProperty("verification_code");
    verificationCode = res.body.doctor.verification_code;
    doctorId = res.body.doctor.doctor_id;
  });

  test("POST /doctor/verify - should verify doctor", async () => {
    const res = await request(app).post("/doctor/verify").send({
      email: doctor.email,
      code: verificationCode,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Doctor verified successfully");
  });

  test("POST /doctor/login - should login verified doctor", async () => {
    const res = await request(app).post("/doctor/login").send({
      email: doctor.email,
      password: doctor.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("GET /doctors - should return all doctors", async () => {
    const res = await request(app).get("/doctors");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /doctor/:id - should return doctor by ID", async () => {
    const res = await request(app).get(`/doctor/${doctorId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(doctor.email);
  });

  test("PUT /doctor/:id - should update doctor info", async () => {
    const res = await request(app).put(`/doctor/${doctorId}`).send({
      specialization: "Neurosurgeon",
    });
    expect(res.status).toBe(200);
    expect(res.body.specialization).toBe(undefined);
  });

  test("DELETE /doctor/:id - should delete doctor", async () => {
    const res = await request(app).delete(`/doctor/${doctorId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Doctor deleted successfully");
  });
});
