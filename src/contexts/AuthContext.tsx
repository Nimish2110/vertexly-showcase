import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  Order, 
  loginUser, 
  registerUser, 
  getUserProfile, 
  getToken, 
  removeToken,
  getMyOrders as fetchMyOrders
} from "@/lib/api";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, password: string, email?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        const { data, error } = await getUserProfile();
        if (data && !error) {
          setUser(data);
          setIsLoggedIn(true);
        } else {
          removeToken();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await loginUser(identifier, password);
    if (data && !error) {
      setUser(data.user);
      setIsLoggedIn(true);
      return { success: true };
    }
    return { success: false, error };
  };

  const register = async (name: string, password: string, email?: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await registerUser(name, password, email, phone);
    if (data && !error) {
      setUser(data.user);
      setIsLoggedIn(true);
      return { success: true };
    }
    return { success: false, error };
  };

  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };

  const refreshUser = async () => {
    const { data } = await getUserProfile();
    if (data) {
      setUser(data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        refreshUser,
      }}
    >
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

export type { User, Order };
