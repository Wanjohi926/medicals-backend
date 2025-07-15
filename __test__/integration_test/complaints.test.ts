import request from "supertest";
import app from "../../src/index";
import db from "../../src/drizzle/db";
import { ComplaintsTable, UsersTable } from "../../src/drizzle/schema";
import { eq } from "drizzle-orm";

describe("Complaint Integration Test (Real DB)", () => {
  const user = {
    first_name: "Test",
    last_name: "User",
    email: "testcomplaintuser@example.com",
    password: "test12345",
    contact_phone: "0700000000",
    address: "Test Address",
    role: "user" as "user",
    is_verified: true
  };

  const complaint = {
    subject: "General Complaint",
    description: "Something went wrong",
    status: "Open"
  };

  let userId: number;
  let complaintId: number;

  beforeAll(async () => {
    const [createdUser] = await db
      .insert(UsersTable)
      .values(user)
      .returning({ user_id: UsersTable.user_id });

    userId = createdUser.user_id;
  });

  afterAll(async () => {
    await db.delete(ComplaintsTable).where(eq(ComplaintsTable.complaint_id, complaintId));
    await db.delete(UsersTable).where(eq(UsersTable.user_id, userId));
  });

  test("POST /complaint - should create a complaint", async () => {
    const res = await request(app).post("/complaint").send({
      ...complaint,
      user_id: userId
    });

    expect(res.status).toBe(201);
    expect(res.body.complaint).toHaveProperty("complaint_id");
    expect(res.body.complaint.subject).toBe("General Complaint");

    complaintId = res.body.complaint.complaint_id;
  });

  test("GET /complaints - should return all complaints", async () => {
    const res = await request(app).get("/complaints");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /complaint/:id - should return complaint by ID", async () => {
    const res = await request(app).get(`/complaint/${complaintId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.complaint_id).toBe(complaintId);
  });

  test("PUT /complaint/:id - should update complaint", async () => {
    const res = await request(app).put(`/complaint/${complaintId}`).send({
      status: "Resolved"
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Resolved");
  });

  test("DELETE /complaint/:id - should delete complaint", async () => {
    const res = await request(app).delete(`/complaint/${complaintId}`);
    expect(res.status).toBe(204);
  });
});
