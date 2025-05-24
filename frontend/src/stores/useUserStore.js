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
  forgotPassword: async (email) => {
  set({ loading: true });
  try {
    const res = await axios.post("/auth/forgot-password", { email });
    set({ loading: false }); // Премахнете set({ user: res.data })
    toast.success("Успешно изпращане на имейл!");
    return res; // Връщайте резултата, за да може ForgotPassword да го обработи
  } catch (error) {
    set({ loading: false });
    toast.error(error.response.data.message || "An error occurred");
    throw error; // Хвърлете грешката, за да може ForgotPassword да я хване
  }
},
resetPassword: async (token, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("auth/reset-password", { token, password });
      set({ loading: false });
      toast.success("Паролата е успешно нулирана!");
      return res;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Възникна грешка при нулиране на паролата");
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
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

    // Няма нужда да проверяваме за промяна на текущия потребител, тъй като ролята му не се променя
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
