import mongoose from "mongoose";
import request from "supertest";
import bcrypt from "bcrypt";
import "dotenv/config.js";

import app from "../../app.js";

import User from "../../models/user.js";

const { DB_HOST, PORT = 3001 } = process.env;

describe("test /users/login", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("test login with correctData", async () => {
    const loginData = {
      email: "cetifit105@ikuromi.com",
      password: "1234567",
    };
    const { statusCode, body } = await request(app).post("/users/login").send(loginData);
    const user = await User.findOne({ email: loginData.email });
    const passwordCompare = await bcrypt.compare(loginData.password, user.password);

    expect(statusCode).toBe(200);
    expect(user.email).toBe(loginData.email);
    expect(passwordCompare).toBe(true);
    expect(body.token).toBe(user.token);
    expect(body.user).toEqual({
      email: loginData.email,
      subscription: user.subscription,
    });
  });
});
