import axios from "axios";

const API_BASE_URL = "https://vertexly-backend.onrender.com/api";
const TOKEN_KEY = "vertexly_token";

// ========== TYPES ==========
export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  status?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id: string;
  userId: string;
  user?: { name: string; email: string };
  templateId: string;
  templateName?: string;
  status: string;
  developerStatus?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  requirements?: string;
  customizationPrice: number;
  discount: number;
  totalPrice: number;
  price?: number;
  deliveryFile?: string;
  downloadLink?: string;
  isCustom?: boolean;
  websiteType?: string;
  businessType?: string;
  deliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

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
export const registerUser = async (name: string, password: string, email?: string, phone?: string) => {
  try {
    const payload: { name: string; password: string; email?: string; phone?: string } = { name, password };
    if (email) {
      payload.email = email;
    }
    if (phone) {
      payload.phone = phone;
    }
    const res = await api.post("/auth/register", payload);
    saveToken(res.data.token);
    return { data: res.data };
  } catch (err: any) {
    return { error: err.response?.data?.message || "Register failed" };
  }
};

export const loginUser = async (identifier: string, password: string) => {
  try {
    // Send identifier as emailOrPhone - backend handles detection
    const payload = { emailOrPhone: identifier, password };
    
    const res = await api.post("/auth/login", payload);
    saveToken(res.data.token);
    return { data: res.data };
  } catch (err: any) {
    return { error: err.response?.data?.message || "Login failed" };
  }
};

// ========== USER ==========
export const getUserProfile = async (): Promise<{ data?: User; error?: string; partial?: boolean }> => {
  try {
    const res = await api.get("/users/profile");
    // Normalize: backend may return { user: {...} } or the user object directly
    const userData = res.data?.user || res.data;
    
    // Normalize _id field (backend sometimes returns 'id' instead of '_id')
    if (userData.id && !userData._id) {
      userData._id = userData.id;
    }
    
    // Backend sometimes returns decoded JWT ({id, role, iat, exp}) instead of full user doc.
    // Detect this by checking for 'name' field.
    if (!userData.name) {
      console.warn("[API] getUserProfile returned data without 'name':", JSON.stringify(userData));
      return { data: userData as User, partial: true };
    }
    
    return { data: userData as User };
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
export const createOrder = async (orderData: {
  templateId: string;
  customizationPrice: number;
  discount: number;
}) => {
  try {
    const res = await api.post("/orders/create", orderData);
    return { data: res.data };
  } catch (err: any) {
    console.error("Create order error:", err.response?.data);
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
    const res = await api.put(`/orders/${orderId}/requirements`, { requirements });
    return { data: res.data };
  } catch (err) {
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

// ========== PAYMENTS ==========
export const createPayment = async (orderId: string) => {
  try {
    const res = await api.post("/payment/create-order", { orderId });
    return { data: res.data };
  } catch (err: any) {
    console.error("Create payment error:", err.response?.data);
    return { error: err.response?.data?.message || "Payment creation failed" };
  }
};

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) => {
  try {
    const res = await api.post("/payment/verify", paymentData);
    return { data: res.data };
  } catch (err: any) {
    console.error("Verify payment error:", err.response?.data);
    return { error: err.response?.data?.message || "Payment verification failed" };
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

export const adminAcceptOrder = async (orderId: string) => {
  try {
    const res = await api.patch(`/admin/orders/${orderId}/accept`);
    return { data: res.data };
  } catch {
    return { error: "Failed to accept order" };
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
    
    // Normalize response: handle both array and object with users property
    let users: User[];
    if (Array.isArray(res.data)) {
      users = res.data;
    } else if (res.data && Array.isArray(res.data.users)) {
      users = res.data.users;
    } else {
      users = [];
    }
    
    return { data: users };
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
