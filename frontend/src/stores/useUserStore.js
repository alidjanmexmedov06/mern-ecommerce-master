import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Паролите не съвпадат!");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, loading: false });
      toast.success("Успешна регистрация!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
      toast.success("Успешен вход!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Излязохте от акаунта си!");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },

  updateUser: async ({ name, email, password, profilePicture }) => {
    set({ loading: true });

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (profilePicture instanceof File) {
        formData.append("profilePicture", profilePicture);
      }

      console.log("Изпращане на данни към бекенда:", { name, email, password, profilePicture });

      const res = await axios.patch("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Отговор от бекенда:", res.data);

      set({ user: res.data, loading: false });
      toast.success("Профилът е актуализиран успешно!");
    } catch (error) {
      set({ loading: false });
      console.error("Грешка при актуализиране на профила:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Възникна грешка при актуализирането на профила");
    }
  },

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/auth/users");
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Грешка при извличане на потребители");
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await axios.delete(`/auth/users/${userId}`);
      toast.success("Потребителят е изтрит успешно!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Грешка при изтриване на потребител");
      throw error;
    }
  },

  makeUserAdmin: async (userId) => {
    try {
      const res = await axios.patch(`/auth/users/${userId}/make-admin`, {
        role: "admin",
      });
  
      // Актуализираме списъка с потребители
      const updatedUsers = res.data;
  
      // Проверяваме дали текущият потребител (Иван) е засегнат от промяната
      const currentUser = get().user;
      if (currentUser && currentUser._id !== userId && currentUser.role === "admin") {
        // Ако текущият потребител е бил администратор, но вече не е (защото Гошо е станал admin),
        // актуализираме състоянието му
        const updatedCurrentUser = updatedUsers.find((u) => u._id === currentUser._id);
        set({ user: updatedCurrentUser });
      }
  
      toast.success("Потребителят е направен администратор успешно!");
      return updatedUsers; // Връщаме списъка с всички потребители
    } catch (error) {
      toast.error(error.response?.data?.message || "Грешка при промяна на ролята");
      throw error;
    }
  },
  
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
