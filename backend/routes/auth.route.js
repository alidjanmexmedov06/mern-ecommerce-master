import { Router } from "express";
import {
  signup, login, logout, refreshToken, getProfile, updateProfile, uploadMiddleware, getAllUsers, 
  deleteUser, makeUserAdmin, forgotPassword, resetPassword,
  createOrder, getOrders, getOrderById, deleteOrder, updateOrderPaidStatus, updateOrderDeliveredStatus,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// Маршрути за автентикация и потребители
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);
router.patch("/profile", protectRoute, uploadMiddleware, updateProfile);
router.get("/users", protectRoute, getAllUsers);
router.delete("/users/:id", protectRoute, deleteUser);
router.patch("/users/:id/make-admin", protectRoute, makeUserAdmin);

// Маршрути за поръчки
router.post("/orders", protectRoute, createOrder);
router.get("/orders", protectRoute, getOrders);
router.get("/orders/:id", protectRoute, getOrderById);
router.delete("/orders/:id", protectRoute, deleteOrder);
router.patch("/orders/:id/paid", protectRoute, updateOrderPaidStatus);
router.patch("/orders/:id/delivered", protectRoute, updateOrderDeliveredStatus);

export default router;