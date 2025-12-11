import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
const TOKEN_KEY = "vertexly_token";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Token helpers
export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// ======================= TYPES =======================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status?: "active" | "deleted";
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Template {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  template: string | Template;
  templateName: string;
  price: number;
  customizationPrice: number;
  discount: number;
  total: number;
  status: string;
  requirements: string;
  requirementsSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

// ======================= AUTH ROUTES =======================

// REGISTER USER
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ data?: AuthResponse; error?: string }> => {
  try {
    const response = await api.post<AuthResponse>("/users/register", {
      name,
      email,
      password,
    });
    saveToken(response.data.token);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || "Registration failed" };
  }
};

// LOGIN USER
export const loginUser = async (
  email: string,
  password: string
): Promise<{ data?: AuthResponse; error?: string }> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    saveToken(response.data.token);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || "Login failed" };
  }
};

// ======================= USER ROUTES =======================

// GET USER PROFILE
export const getUserProfile = async (): Promise<{ data?: User; error?: string }> => {
  try {
    const response = await api.get<User>("/users/profile");
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || "Failed to fetch profile" };
  }
};

// ======================= TEMPLATE ROUTES =======================

// GET ALL TEMPLATES
export const getTemplates = async (): Promise<{ data?: Template[]; error?: string }> => {
  try {
    const response = await api.get<Template[]>("/templates");
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || "Failed to load templates" };
  }
};

// ======================= ORDER ROUTES =======================

// CREATE ORDER
export const createOrder = async (orderData: {
  templateId: string;
  customizationPrice?: number;
  discount?: number;
}): Promise<{ data?: Order; error?: string }> => {
  try {
    const response = await api.post<Order>("/orders/create", orderData);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || "Failed to create order" };
  }
};

// GET MY ORDERS
export const getMyOrders = async (): Promise<{ data?: Order[]; error?: string }> => {
  try {
    const response = await api.get<Order[]>("/orders/my-orders");
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || "Failed to load orders" };
  }
};

// SUBMIT REQUIREMENTS
export const submitRequirements = async (
  orderId: string,
  requirements: string
): Promise<{ data?: Order; error?: string }> => {
  try {
    const response = await api.put<Order>(`/orders/${orderId}/requirements`, {
      requirements,
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || "Failed to submit requirements" };
  }
};

// DOWNLOAD DELIVERY FILE
export const downloadDelivery = async (
  orderId: string
): Promise<{ data?: Blob; error?: string }> => {
  try {
    const response = await api.get(`/orders/${orderId}/download`, {
      responseType: "blob",
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || "Download failed" };
  }
};

// ======================= ADMIN ORDER ROUTES =======================

// GET ALL ORDERS (ADMIN)
export const adminGetOrders = async () => {
  try {
    const response = await api.get<Order[]>("/admin/orders");
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message };
  }
};

// UPDATE ORDER STATUS (ADMIN)
export const adminUpdateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.patch<Order>(
      `/admin/orders/${orderId}/status`,
      { status }
    );
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message };
  }
};

// UPLOAD DELIVERY FILE (ADMIN)
export const adminUploadDelivery = async (orderId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.patch<Order>(
      `/admin/orders/${orderId}/delivery`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message };
  }
};

// ======================= ADMIN USER ROUTES =======================

export const adminGetUsers = async () => {
  try {
    const response = await api.get<User[]>("/admin/users");
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message };
  }
};

export const adminGetUser = async (userId: string) => {
  try {
    const response = await api.get<User>(`/admin/users/${userId}`);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message };
  }
};

export const adminUpdateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await api.put<User>(`/admin/users/${userId}`, userData);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message };
  }
};

export const adminDeleteUser = async (userId: string) => {
  try {
    const response = await api.delete<{ message: string }>(`/admin/users/${userId}`);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message };
  }
};

export const adminRestoreUser = async (userId: string) => {
  try {
    const response = await api.patch<User>(`/admin/users/${userId}/restore`);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.message };
  }
};

export default api;
