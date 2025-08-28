import { useAuthStore } from "./index.ts";

export const useLogin = () => {
  const { user, isLoading, error, login, logout, clearError, setUser } =
    useAuthStore();

  const isAuthenticated = user?.is_logged_in === 1;
  const token = user?.token;
  const username = user?.username;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    username,

    login,
    logout,
    clearError,
    setUser,
  };
};
