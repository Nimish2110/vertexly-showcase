import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
const TOKEN_KEY = "vertexly_token";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ========== TOKEN HELPERS ==========
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// ========== AUTH ==========
export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    saveToken(res.data.token);
    return { data: res.data };
  } catch (err: any) {
    return { error: err.response?.data?.message || "Register failed" };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    saveToken(res.data.token);
    return { data: res.data };
  } catch (err: any) {
    return { error: err.response?.data?.message || "Login failed" };
  }
};

// ========== USER ==========
export const getUserProfile = async () => {
  try {
    const res = await api.get("/users/profile");
    return { data: res.data };
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to load profile" };
  }
};

// ========== TEMPLATES ==========
export const getTemplates = async () => {
  try {
    const res = await api.get("/templates");
    return { data: res.data };
  } catch {
    return { error: "Template fetch failed" };
  }
};

// ========== ORDERS ==========
export const createOrder = async (orderData: any) => {
  try {
    const res = await api.post("/orders/create", orderData);
    return { data: res.data.order }; // <-- returns ONLY the order object
  } catch (err: any) {
    return { error: err.response?.data?.message || "Order creation failed" };
  }
};

export const getMyOrders = async () => {
  try {
    const res = await api.get("/orders/my-orders");
    return { data: res.data };
  } catch {
    return { error: "Failed to load orders" };
  }
};

export const submitRequirements = async (orderId: string, requirements: string) => {
  try {
    const res = await api.post(`/orders/requirements/${orderId}`, { requirements });
    return { data: res.data };
  } catch {
    return { error: "Failed to submit requirements" };
  }
};

export const downloadDelivery = async (orderId: string) => {
  try {
    const res = await api.get(`/orders/${orderId}/download`, { responseType: "blob" });
    return { data: res.data };
  } catch {
    return { error: "Download failed" };
  }
};

// ========== ADMIN: ORDERS ==========
export const adminGetOrders = async () => {
  try {
    const res = await api.get("/admin/orders");
    return { data: res.data };
  } catch {
    return { error: "Failed to load orders" };
  }
};

export const adminUpdateOrderStatus = async (orderId: string, status: string) => {
  try {
    const res = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return { data: res.data };
  } catch {
    return { error: "Status update failed" };
  }
};

export const adminUploadDelivery = async (orderId: string, file: File) => {
  try {
    const fd = new FormData();
    fd.append("file", file);

    const res = await api.patch(`/admin/orders/${orderId}/delivery`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { data: res.data };
  } catch {
    return { error: "Upload failed" };
  }
};

// ========== ADMIN: USERS ==========
export const adminGetUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return { data: res.data };
  } catch {
    return { error: "Failed to load users" };
  }
};

export const adminGetUser = async (userId: string) => {
  try {
    const res = await api.get(`/admin/users/${userId}`);
    return { data: res.data };
  } catch {
    return { error: "Failed to load user" };
  }
};

export const adminUpdateUser = async (userId: string, updates: any) => {
  try {
    const res = await api.put(`/admin/users/${userId}`, updates);
    return { data: res.data };
  } catch {
    return { error: "User update failed" };
  }
};

export const adminDeleteUser = async (userId: string) => {
  try {
    const res = await api.delete(`/admin/users/${userId}`);
    return { data: res.data };
  } catch {
    return { error: "Delete failed" };
  }
};

export const adminRestoreUser = async (userId: string) => {
  try {
    const res = await api.patch(`/admin/users/${userId}/restore`);
    return { data: res.data };
  } catch {
    return { error: "Restore failed" };
  }
};

export default api;
