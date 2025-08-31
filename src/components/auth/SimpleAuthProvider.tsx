
import React, { createContext, useContext, ReactNode } from "react";

type SimpleUser = {
  id?: string;
  email?: string;
} | null;

interface AuthContextValue {
  user: SimpleUser;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const defaultAuthValue: AuthContextValue = {
  user: null,
  isLoading: false,
  // Default to authenticated for development to avoid redirects
  isAuthenticated: true,
};

const AuthContext = createContext<AuthContextValue>(defaultAuthValue);

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={defaultAuthValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
