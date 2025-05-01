const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");

class UserController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      const newUser = await User.create({
        username,
        email,
        password,
      });

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" }); // Changed to 404 for clarity
      }

      const isPasswordValid = comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" }); // Separated error for clarity
      }

      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = createToken(payload);

      res.status(200).json({
        access_token: token,
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateUser(req, res) {
    try {
      const userId = req.user.id;
      const { username, email } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const updateFields = {};

      if (username) updateFields.username = username;
      if (email) updateFields.email = email;

      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ message: "Tidak ada data yang diupdate" });
      }

      await user.update(updateFields);

      res.status(200).json({
        message: "User berhasil diupdate",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

module.exports = UserController;
