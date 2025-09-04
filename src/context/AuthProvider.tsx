/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from "react";
import type { AuthContextValue } from "../types/auth";
import { useGetCurrentUser } from "../services/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { data: currentUser, isLoading } = useGetCurrentUser();

  const value = useMemo<AuthContextValue>(
    () => ({
      user: currentUser ?? null,
      role: currentUser?.roles[0],
      isLoadingCurrentUser: isLoading,
      isAuthenticated: !!currentUser,
    }),
    [currentUser, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used within <AuthProvider>");
  return ctx;
};
