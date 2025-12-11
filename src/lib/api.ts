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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
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

// Helper to save token
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Helper to remove token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Helper to get token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// ============ TYPES ============

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
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  price: number;
  previewUrl?: string;
  rating?: number;
  reviews?: number;
}

export interface Order {
  _id: string;
  user: User | string;
  templateId?: string;
  templateName: string;
  price: number;
  requirements: string;
  developerStatus: "pending" | "requirements_submitted" | "accepted" | "rejected" | "in_progress" | "completed";
  paymentStatus: "pending" | "paid";
  deliveryStatus: "pending" | "delivered" | "cancelled";
  downloadLink?: string;
  isCustom?: boolean;
  websiteType?: string;
  businessType?: string;
  deliveryTime?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

// ============ AUTH ROUTES ============

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
    const message = error.response?.data?.message || "Registration failed";
    return { error: message };
  }
};

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
    const message = error.response?.data?.message || "Login failed";
    return { error: message };
  }
};

// ============ USER ROUTES ============

export const getUserProfile = async (): Promise<{ data?: User; error?: string }> => {
  try {
    const response = await api.get<User>("/users/profile");
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to get profile";
    return { error: message };
  }
};

// ============ TEMPLATE ROUTES ============

export const getTemplates = async (): Promise<{ data?: Template[]; error?: string }> => {
  try {
    const response = await api.get<Template[]>("/templates");
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to get templates";
    return { error: message };
  }
};

// ============ ORDER ROUTES ============

export const createOrder = async (orderData: {
  templateId?: string;
  templateName: string;
  price: number;
  requirements?: string;
  isCustom?: boolean;
  websiteType?: string;
  businessType?: string;
  deliveryTime?: string;
}): Promise<{ data?: Order; error?: string }> => {
  try {
    const response = await api.post<Order>("/orders", orderData);
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to create order";
    return { error: message };
  }
};

export const getMyOrders = async (): Promise<{ data?: Order[]; error?: string }> => {
  try {
    const response = await api.get<Order[]>("/orders/my-orders");
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to get orders";
    return { error: message };
  }
};

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
    const message = error.response?.data?.message || "Failed to submit requirements";
    return { error: message };
  }
};

export const downloadDelivery = async (
  orderId: string
): Promise<{ data?: Blob; error?: string }> => {
  try {
    const response = await api.get(`/orders/${orderId}/download`, {
      responseType: "blob",
    });
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to download delivery";
    return { error: message };
  }
};

// ============ ADMIN ORDER ROUTES ============

export const adminGetOrders = async (): Promise<{ data?: Order[]; error?: string }> => {
  try {
    const response = await api.get<Order[]>("/admin/orders");
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to get orders";
    return { error: message };
  }
};

export const adminUpdateOrderStatus = async (
  orderId: string,
  status: Order["developerStatus"]
): Promise<{ data?: Order; error?: string }> => {
  try {
    const response = await api.patch<Order>(`/admin/orders/${orderId}/status`, {
      status,
    });
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update order status";
    return { error: message };
  }
};

export const adminUploadDelivery = async (
  orderId: string,
  file: File
): Promise<{ data?: Order; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.patch<Order>(
      `/admin/orders/${orderId}/delivery`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to upload delivery";
    return { error: message };
  }
};

// ============ ADMIN USER ROUTES ============

export const adminGetUsers = async (): Promise<{ data?: User[]; error?: string }> => {
  try {
    const response = await api.get<User[]>("/admin/users");
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to get users";
    return { error: message };
  }
};

export const adminGetUser = async (
  userId: string
): Promise<{ data?: User; error?: string }> => {
  try {
    const response = await api.get<User>(`/admin/users/${userId}`);
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to get user";
    return { error: message };
  }
};

export const adminUpdateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<{ data?: User; error?: string }> => {
  try {
    const response = await api.put<User>(`/admin/users/${userId}`, userData);
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update user";
    return { error: message };
  }
};

export const adminDeleteUser = async (
  userId: string
): Promise<{ data?: { message: string }; error?: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/admin/users/${userId}`);
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to delete user";
    return { error: message };
  }
};

export const adminRestoreUser = async (
  userId: string
): Promise<{ data?: User; error?: string }> => {
  try {
    const response = await api.patch<User>(`/admin/users/${userId}/restore`);
    return { data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to restore user";
    return { error: message };
  }
};

export default api;
