import request from "supertest";
import app from "../../src/index";
import db from "../../src/drizzle/db";
import { UsersTable } from "../../src/drizzle/schema";
import { eq } from "drizzle-orm";

describe("User Integration Test (Real DB)", () => {
  const user = {
    first_name: "Alice",
    last_name: "Wanjiku",
    email: "alicewanjiku@example.com",
    password: "TestPass123",
    contact_phone: "0798765432",
    address: "Nairobi",
    role: "user"
  };

  let userId: number;
  let verificationCode: string;
  let token: string;

  afterAll(async () => {
    await db.delete(UsersTable).where(eq(UsersTable.email, user.email));
  });

  test("POST /user - should create user", async () => {
    const res = await request(app).post("/user").send(user);
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("user_id");
    expect(res.body.user).toHaveProperty("verification_code");
    verificationCode = res.body.user.verification_code;
    userId = res.body.user.user_id;
  });

  test("POST /user/verify - should verify user", async () => {
    const res = await request(app).post("/user/verify").send({
      email: user.email,
      code: verificationCode,
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User verified successfully");
  });

  test("POST /user/login - should login verified user", async () => {
    const res = await request(app).post("/user/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("GET /users - should return all users", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /user/:id - should return user by ID", async () => {
    const res = await request(app).get(`/user/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(user.email);
  });

  test("PUT /user/:id - should update user info", async () => {
    const res = await request(app).put(`/user/${userId}`).send({
      address: "Mombasa",
    });
    expect(res.status).toBe(200);
    expect(res.body.address).toBe("Mombasa");
  });

  test("DELETE /user/:id - should delete user", async () => {
    const res = await request(app).delete(`/user/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });
});
