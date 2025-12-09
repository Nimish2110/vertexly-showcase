import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface Purchase {
  id: string;
  templateName: string;
  price: number;
  requirements: string;
  selectedDate: string;
  developerStatus: "pending" | "requirements_submitted" | "accepted" | "rejected" | "in_progress" | "completed";
  paymentStatus: "pending" | "paid";
  deliveryStatus: "pending" | "delivered" | "cancelled";
  isCustom?: boolean;
  websiteType?: string;
  businessType?: string;
  deliveryTime?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  purchases: Purchase[];
  login: (email: string) => void;
  logout: () => void;
  addPurchase: (purchase: Omit<Purchase, "id">) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: "1",
      templateName: "Zay Ecommerce",
      price: 5000,
      requirements: "Need product filtering and cart functionality",
      selectedDate: "2024-01-15",
      developerStatus: "completed",
      paymentStatus: "paid",
      deliveryStatus: "delivered",
    },
    {
      id: "2",
      templateName: "Motora Car Service",
      price: 6000,
      requirements: "Add booking system for car appointments",
      selectedDate: "2024-01-20",
      developerStatus: "accepted",
      paymentStatus: "pending",
      deliveryStatus: "pending",
    },
    {
      id: "3",
      templateName: "Famms Fashion Store",
      price: 6500,
      requirements: "Include size charts and wishlist feature",
      selectedDate: "2024-01-22",
      developerStatus: "requirements_submitted",
      paymentStatus: "pending",
      deliveryStatus: "pending",
    },
    {
      id: "4",
      templateName: "Pod Talk Podcast",
      price: 7000,
      requirements: "Audio player integration needed",
      selectedDate: "2024-01-25",
      developerStatus: "in_progress",
      paymentStatus: "paid",
      deliveryStatus: "pending",
    },
  ]);

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUser({
      name: "John Doe",
      email: email,
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const addPurchase = (purchase: Omit<Purchase, "id">) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
    };
    setPurchases((prev) => [...prev, newPurchase]);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, purchases, login, logout, addPurchase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export type { Purchase };
