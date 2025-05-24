import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";


// Настройка на multer за качване на файлове
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(await bcrypt.hash(password, 10));
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Потребителят не е намерен" });
    }

    if (name) user.name = name;
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Имейлът вече е използван от друг потребител" });
      }
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    if (req.file) {
      let cloudinaryResponse = null;
      
          
        cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, { folder: "products" });
          
      console.log("Запазване на нова профилна снимка:", req.file.filename);
      user.profilePicture = cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "";
    }

    await user.save();
    console.log("Потребителят е актуализиран:", user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log("Error in updateProfile controller:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadMiddleware = upload.single("profilePicture");

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Само админи могат да достъпват списъка с потребители" });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Само админи могат да изтриват потребители" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Потребителят не е намерен" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Не можете да изтриете собствения си акаунт" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Потребителят е изтрит успешно" });
  } catch (error) {
    console.log("Error in deleteUser controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const makeUserAdmin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Не сте автентикиран!" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Само админи могат да променят ролята на потребители" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Потребителят не е намерен" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Не можете да промените ролята на собствения си акаунт" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Потребителят вече е администратор" });
    }

    // Задаваме ролята на потребителя на "admin", без да променяме другите администратори
    user.role = "admin";
    await user.save();

    const updatedUsers = await User.find().select("-password");
    res.status(200).json(updatedUsers);
  } catch (error) {
    console.log("Error in makeUserAdmin controller:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Контролери за поръчки

export const getOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Само админи могат да достъпват списъка с поръчки" });
    }

    const orders = await Order.find()
      .populate("user", "name")
      .populate("products.product", "name image");

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getOrders controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Само админи могат да преглеждат поръчки" });
    }

    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("user", "name")
      .populate("products.product", "name image");

    if (!order) {
      return res.status(404).json({ message: "Поръчката не е намерена" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log("Error in getOrderById controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Само админи могат да изтриват поръчки" });
    }

    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Поръчката не е намерена" });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Поръчката е изтрита успешно" });
  } catch (error) {
    console.log("Error in deleteOrder controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, stripeSessionId } = req.body;
    const userId = req.user._id;

    if (!products || !totalAmount) {
      return res.status(400).json({ message: "Моля, предоставете продукти и обща сума" });
    }

    const order = await Order.create({
      user: userId,
      products,
      totalAmount,
      stripeSessionId,
      isPaid: false,
      isDelivered: false,
    });

    res.status(201).json(order);
  } catch (error) {
    console.log("Error in createOrder controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderPaidStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Само админи могат да променят статуса на поръчка" });
    }

    const orderId = req.params.id;
    const { isPaid } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Поръчката не е намерена" });
    }

    order.isPaid = isPaid;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log("Error in updateOrderPaidStatus controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderDeliveredStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Само админи могат да променят статуса на поръчка" });
    }

    const orderId = req.params.id;
    const { isDelivered } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Поръчката не е намерена" });
    }

    order.isDelivered = isDelivered;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log("Error in updateOrderDeliveredStatus controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Потребителят не е намерен" });
    }

    // Генериране на токен и хеш
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 минути
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Настройка на пощенския клиент
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Игнорира самоподписани сертификати
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Нулиране на парола",
      html: `<p>Кликнете на линка, за да нулирате паролата си:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Имейлът е изпратен успешно:", mailOptions);

    res.json({ message: "Имейлът е изпратен успешно" });

  } catch (error) {
    console.log("Error in forgotPassword controller", error.message);
    res.status(500).json({ message: "Възникна грешка при изпращане на имейла" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Невалиден или изтекъл токен" });
    }
    console.log(password);
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Паролата е успешно нулирана" });
  } catch (error) {
    console.log("Error in resetPassword controller", error.message);
    res.status(500).json({ message: "Възникна грешка при нулиране на паролата" });
  }
};
