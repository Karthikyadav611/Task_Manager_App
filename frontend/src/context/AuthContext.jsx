import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi, registerAuthLogoutHandler } from "../services/api";

const TOKEN_STORAGE_KEY = "task_manager_token";
const USER_STORAGE_KEY = "task_manager_user";

const AuthContext = createContext(null);

const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

const storeAuth = (token, user) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setToken("");
  }, []);

  useEffect(() => {
    registerAuthLogoutHandler(logout);
    return () => registerAuthLogoutHandler(null);
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        clearStoredAuth();
      }
    }

    setIsBootstrapping(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    storeAuth(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    storeAuth(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, token, isBootstrapping, login, register, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
};
