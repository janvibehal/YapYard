import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Routes", () => {
  const testUser = {
    name: "TestUser",
    email: "test@example.com",
    password: "Password123",
  };

  afterEach(async () => {
    await User.deleteMany({ email: testUser.email });
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should login successfully and return a JWT", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with invalid password", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "WrongPass" });

    expect(res.statusCode).toBe(401);
  });
});
