const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { User, XiaomiDevice, Favorite } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");

let access_token;

beforeAll(async () => {
  try {
    await Favorite.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await User.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await XiaomiDevice.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashPassword("password123"),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await XiaomiDevice.create({
      key: "xiaomi-1",
      device_name: "Xiaomi Test Phone",
      device_image: "https://example.com/image.jpg",
      display_size: "6.5 inches",
      display_res: "1080 x 2400 pixels",
      camera: "48MP + 8MP + 5MP",
      video: "4K@30fps",
      ram: "6GB",
      chipset: "Snapdragon 732G",
      battery: "5000mAh",
      batteryType: "Li-Po",
      body: "Plastic back, plastic frame",
      os_type: "Android 11, MIUI 12",
      storage: "128GB",
      comment: "Excellent mid-range phone",
      price: 3000000,
    });

    const user = await User.findOne({ where: { email: "test@example.com" } });
    access_token = createToken({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Error in beforeAll:", error);
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe("User Authentication", () => {
  test("Register user baru dengan sukses", async () => {
    const response = await request(app).post("/register").send({
      username: "newuser",
      email: "new@example.com",
      password: "newpassword123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username", "newuser");
    expect(response.body).toHaveProperty("email", "new@example.com");
  });

  test("Gagal register karena email sudah digunakan", async () => {
    const response = await request(app).post("/register").send({
      username: "duplicateuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("Login dengan sukses", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body).toHaveProperty("username", "testuser");
    access_token = response.body.access_token;
  });

  test("Gagal login karena password salah", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid password");
  });

  test("Gagal login karena email tidak ditemukan", async () => {
    const response = await request(app).post("/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});

describe("Authenticated Endpoints", () => {
  test("Mendapatkan daftar device lengkap dengan sukses", async () => {
    const response = await request(app)
      .get("/devices")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("device_name");
    expect(response.body[0]).toHaveProperty("camera");
  });

  test("Mendapatkan detail device lengkap dengan sukses", async () => {
    const response = await request(app)
      .get("/devices/1")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("device_name");
    expect(response.body).toHaveProperty("camera");
  });

  test("Menambahkan device ke favorit dengan sukses", async () => {
    await Favorite.destroy({ where: { XiaomiDeviceId: 1 } });

    const response = await request(app)
      .post("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Device berhasil ditambahkan ke favorit"
    );
  });

  test("Gagal menambahkan device ke favorit karena sudah ada", async () => {
    const response = await request(app)
      .post("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Device sudah ada di daftar favorit Anda"
    );
  });

  test("Mendapatkan daftar favorit dengan sukses", async () => {
    const response = await request(app)
      .get("/favorites")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Menghapus device dari favorit dengan sukses", async () => {
    const response = await request(app)
      .delete("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Device berhasil dihapus dari favorit"
    );
  });

  test("Gagal menghapus device dari favorit karena tidak ada", async () => {
    const response = await request(app)
      .delete("/favorites/1")
      .set("access_token", access_token);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Device tidak ada di daftar favorit Anda"
    );
  });
});

describe("Authentication Middleware", () => {
  test("Gagal mengakses endpoint terproteksi tanpa token", async () => {
    const response = await request(app).get("/favorites");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Gagal mengakses endpoint terproteksi dengan token invalid", async () => {
    const response = await request(app)
      .get("/favorites")
      .set("access_token", "invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});
