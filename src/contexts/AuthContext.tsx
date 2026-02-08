import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  Order, 
  loginUser, 
  registerUser, 
  getUserProfile, 
  getToken, 
  removeToken
} from "@/lib/api";

const USER_STORAGE_KEY = "vertexly_user";

const saveUserToStorage = (user: User) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {}
};

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const clearUserFromStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

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
  // Rehydrate from localStorage immediately so name is visible before API call
  const cachedUser = loadUserFromStorage();
  const hasToken = !!getToken();

  const [isLoggedIn, setIsLoggedIn] = useState(hasToken && !!cachedUser);
  const [user, setUser] = useState<User | null>(cachedUser);
  const [isLoading, setIsLoading] = useState(hasToken); // only loading if we need to verify token

  // Verify token and refresh user data from backend on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        const { data, error } = await getUserProfile();
        if (data && !error) {
          setUser(data);
          saveUserToStorage(data);
          setIsLoggedIn(true);
        } else {
          // Token invalid - clear everything
          removeToken();
          clearUserFromStorage();
          setUser(null);
          setIsLoggedIn(false);
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
      saveUserToStorage(data.user);
      setIsLoggedIn(true);
      return { success: true };
    }
    return { success: false, error };
  };

  const register = async (name: string, password: string, email?: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await registerUser(name, password, email, phone);
    if (data && !error) {
      setUser(data.user);
      saveUserToStorage(data.user);
      setIsLoggedIn(true);
      return { success: true };
    }
    return { success: false, error };
  };

  const logout = () => {
    removeToken();
    clearUserFromStorage();
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
      saveUserToStorage(data);
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
