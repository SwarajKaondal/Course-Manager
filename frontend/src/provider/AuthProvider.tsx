import React, { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../utils/LocalStorage";
import { User } from "../models/models";

interface AuthProviderProps {
  children: React.ReactNode;
}

export type AuthContextType = {
  user: User | null;
  login: (data: User) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const getRedirectPath = (role_name: String) => {
  console.log(role_name);
  switch (role_name) {
    case "Admin":
      return "/admin";
    case "Faculty":
      return "/faculty";
    case "Teaching Assistant":
      return "/ta";
    case "Student":
      return "/student";
    default:
      return "/";
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const navigate = useNavigate();

  // Call this function when you want to authenticate the user
  const login = async (data: User): Promise<void> => {
    setUser(data);
    const redirectPath = getRedirectPath(data.role_name);
    navigate(redirectPath, { replace: true });
  };

  // Call this function to sign out the logged-in user
  const logout = (): void => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
