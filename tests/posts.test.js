/**
 * @file 
 * @description 
 */

import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/user.js";
import Post from "../models/post.js";
import { generateToken } from "../lib/auth.js";

let token, user;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // creating a test user and JWT
  user = await User.create({
    name: "Poster",
    email: "poster@example.com",
    password: "Password123",
  });
  token = generateToken({ id: user._id, role: "user" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post Routes", () => {
  let createdPostId;

  it("should create a new post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        content: "This is a test post",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("post");
    createdPostId = res.body.post._id;
  });

  it("should fetch list of posts", async () => {
    const res = await request(app)
      .get("/api/posts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it("should delete the created post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${createdPostId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
