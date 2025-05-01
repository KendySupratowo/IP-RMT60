if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const authentication = require("./middlewares/authentication");
const UserController = require("./controllers/UserController");
const Controller = require("./controllers/Controller");
const PubController = require("./controllers/PubController");
const testingRoutes = require("./routes/testing");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing routes
app.use("/testing", testingRoutes);

// Route untuk public (tanpa login)
app.get("/public/devices", PubController.getAllDevices);
app.get("/public/devices/:id", PubController.getDeviceById);

// Route untuk user (login & register)
app.post("/register", UserController.register);
app.post("/login", UserController.login);
app.post("/login/google", UserController.googleLogin);

// Middleware authentication untuk semua rute dibawah ini
app.use(authentication);

// Routes that require authentication
app.get("/devices", Controller.getAllDevices);
app.get("/devices/:id", Controller.getDeviceById);
app.put("/users/update", UserController.updateUser);
app.post("/favorites/:XiaomiDeviceId", Controller.addToFavorites);
app.get("/favorites", Controller.getFavorites);
app.delete("/favorites/:XiaomiDeviceId", Controller.removeFromFavorites);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
