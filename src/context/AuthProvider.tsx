/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { qk } from "../utils/queryKeys";
import { storage } from "../utils/storage";
import type { LoginResponse, User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  isLoadingUser: boolean;
  login: (payload: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used within <AuthProvider>");
  return ctx;
};

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Load current user if token exists
  // const { data, isLoading, refetch } = useQuery({
  //   queryKey: qk.me,
  //   queryFn: authService.me,
  //   enabled: !!token,
  //   staleTime: 1000 * 60 * 5,
  //   retry: false,
  // });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (res) => {
      setToken(res.token);
      setUser(res.user);
      setIsLoadingUser(false);
      // await queryClient.invalidateQueries({ queryKey: qk.me });
      // await refetch();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      setToken(null);
      queryClient.removeQueries({ queryKey: qk.me });
    },
    onSettled: () => {
      setToken(null);
    },
  });

  // Keep token in sync with localStorage changes across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth_token") {
        setToken(e.newValue);
        if (!e.newValue) {
          queryClient.removeQueries({ queryKey: qk.me });
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoadingUser,
      token,
      login: async (payload) => {
        await loginMutation.mutateAsync(payload);
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
    }),
    [user, token, loginMutation, logoutMutation, isLoadingUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

