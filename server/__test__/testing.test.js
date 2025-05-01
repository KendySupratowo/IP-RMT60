const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { User, XiaomiDevice, Favorite } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const fs = require("fs").promises;

let access_token;

// File ini adalah ROUTER EXPRESS, bukan file testing Jest
// Jadi kita harus memisahkan file testing dari router
// Buat file routes/testing.js terpisah untuk fungsi router

// Memastikan database dalam keadaan yang diketahui sebelum testing
beforeAll(async () => {
  try {
    // Reset dan seed database untuk testing
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

    // Seed test user
    await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123", // Model akan melakukan hash via hook
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed test device
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

    // Login untuk mendapatkan token
    const user = await User.findOne({ where: { email: "test@example.com" } });
    access_token = createToken({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Error in beforeAll:", error);
  }
});

afterAll(async () => {
  // Clean up after tests
  await sequelize.close();
});

// Test suite untuk user authentication
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
      email: "test@example.com", // Email yang sudah ada di database
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
    access_token = response.body.access_token; // Update token untuk test berikutnya
  });

  test("Gagal login karena password salah", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("Gagal login karena email tidak ditemukan", async () => {
    const response = await request(app).post("/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});

// Test suite untuk public endpoints
describe("Public Endpoints", () => {
  // Seed additional test devices for sort/filter testing
  beforeAll(async () => {
    await XiaomiDevice.bulkCreate([
      {
        key: "xiaomi-2",
        device_name: "Redmi Note 10",
        device_image: "https://example.com/note10.jpg",
        display_size: "6.43 inches",
        display_res: "1080 x 2400 pixels",
        camera: "48MP",
        video: "4K@30fps",
        ram: "4GB",
        chipset: "Snapdragon 678",
        battery: "5000mAh",
        batteryType: "Li-Po",
        body: "Glass front, plastic back",
        os_type: "Android 11, MIUI 12",
        storage: "64GB",
        comment: "Budget friendly phone",
        price: 2500000,
      },
      {
        key: "xiaomi-3",
        device_name: "Poco F3",
        device_image: "https://example.com/pocof3.jpg",
        display_size: "6.67 inches",
        display_res: "1080 x 2400 pixels",
        camera: "48MP + 8MP + 5MP",
        video: "4K@30fps",
        ram: "8GB",
        chipset: "Snapdragon 870",
        battery: "4520mAh",
        batteryType: "Li-Po",
        body: "Glass front, glass back",
        os_type: "Android 11, MIUI 12",
        storage: "256GB",
        comment: "Flagship killer",
        price: 4500000,
      },
    ]);
  });

  test("Mendapatkan daftar device publik dengan sukses", async () => {
    const response = await request(app).get("/public/devices");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("devices");
    expect(response.body).toHaveProperty("pagination");
    expect(Array.isArray(response.body.devices)).toBe(true);
    expect(response.body.devices.length).toBeGreaterThan(0);
  });

  test("Sorting - mendapatkan devices terurut berdasarkan harga tertinggi", async () => {
    const response = await request(app).get(
      "/public/devices?sort=price&order=desc"
    );

    expect(response.status).toBe(200);
    const prices = response.body.devices.map((device) => device.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test("Sorting - mendapatkan devices terurut berdasarkan nama", async () => {
    const response = await request(app).get(
      "/public/devices?sort=device_name&order=asc"
    );

    expect(response.status).toBe(200);
    const names = response.body.devices.map((device) => device.device_name);
    expect(names).toEqual([...names].sort());
  });

  test("Search - mendapatkan devices dengan kata kunci 'Redmi'", async () => {
    const response = await request(app).get("/public/devices?search=Redmi");

    expect(response.status).toBe(200);
    expect(
      response.body.devices.every(
        (device) =>
          device.device_name.toLowerCase().includes("redmi") ||
          device.key.toLowerCase().includes("redmi")
      )
    ).toBe(true);
  });

  test("Filter - mendapatkan devices dengan RAM 8GB", async () => {
    const response = await request(app).get("/public/devices?ram=8GB");

    expect(response.status).toBe(200);
    expect(
      response.body.devices.every((device) => device.ram.includes("8GB"))
    ).toBe(true);
  });

  test("Filter - mendapatkan devices dengan storage 256GB", async () => {
    const response = await request(app).get("/public/devices?storage=256GB");

    expect(response.status).toBe(200);
    expect(
      response.body.devices.every((device) => device.storage.includes("256GB"))
    ).toBe(true);
  });

  test("Filter - mendapatkan devices dengan range harga", async () => {
    const response = await request(app).get(
      "/public/devices?minPrice=2000000&maxPrice=4000000"
    );

    expect(response.status).toBe(200);
    expect(
      response.body.devices.every(
        (device) => device.price >= 2000000 && device.price <= 4000000
      )
    ).toBe(true);
  });

  test("Kombinasi sort, search dan filter", async () => {
    const response = await request(app).get(
      "/public/devices?search=Poco&sort=price&order=desc&minPrice=3000000"
    );

    expect(response.status).toBe(200);
    expect(
      response.body.devices.every(
        (device) =>
          (device.device_name.toLowerCase().includes("poco") ||
            device.key.toLowerCase().includes("poco")) &&
          device.price >= 3000000
      )
    ).toBe(true);

    const prices = response.body.devices.map((device) => device.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test("Mendapatkan detail device publik dengan sukses", async () => {
    const response = await request(app).get("/public/devices/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("device_name");
    expect(response.body).toHaveProperty("price");
  });

  test("Gagal mendapatkan device yang tidak ada", async () => {
    const response = await request(app).get("/public/devices/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Device tidak ditemukan");
  });
});

// Test suite untuk endpoints dengan authentication
describe("Authenticated Endpoints", () => {
  test("Mendapatkan daftar device lengkap dengan sukses", async () => {
    const response = await request(app)
      .get("/devices")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("device_name");
    expect(response.body[0]).toHaveProperty("camera"); // Informasi detail disertakan
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
    // Hapus data favorit yang mungkin sudah ada
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

// Test suite for authentication middleware only
describe("Authentication Middleware", () => {
  test("Gagal mengakses endpoint terproteksi tanpa token", async () => {
    const response = await request(app).get("/favorites");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Login terlebih dahulu untuk mengakses fitur ini"
    );
  });

  test("Gagal mengakses endpoint terproteksi dengan token invalid", async () => {
    const response = await request(app)
      .get("/favorites")
      .set("access_token", "invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});
