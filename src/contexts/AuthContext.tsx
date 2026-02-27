import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  getSession,
  login as mockLogin,
  register as mockRegister,
  logout as mockLogout,
  requestReset as mockReset,
  type MockSession,
  type MockUser,
} from "@/mock/authMock";

interface AuthContextValue {
  user: MockUser | null;
  session: MockSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  requestReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MockSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(getSession());
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const s = await mockLogin(email, password);
    setSession(s);
  };

  const register = async (email: string, password: string, fullName: string) => {
    const s = await mockRegister(email, password, fullName);
    setSession(s);
  };

  const logout = () => {
    mockLogout();
    setSession(null);
  };

  const requestReset = async (email: string) => {
    await mockReset(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        register,
        logout,
        requestReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
