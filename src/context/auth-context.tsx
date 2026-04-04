import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useFetchApi from "../hooks/use-fetch";
import type { AuthSession, AuthUser } from "@/lib/types";

export type User = AuthUser;

export interface Credentials {
  correoElectronico: string;
  clave: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deberia estar dentro de AuthProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const { get, post } = useFetchApi();

  const checkUserSession = useCallback(async () => {
    // Si no hay token, no hay sesión activa
    if (!localStorage.getItem("token")) {
      setIsLoading(false);
      return;
    }

    try {
      const statusResponse = await get<AuthSession>("/auth/check-status");
      setUser(statusResponse.user);
      setToken(statusResponse.token);
      localStorage.setItem("token", statusResponse.token); // Guardamos el token actualizado
    } catch {
      // Si check-status falla, el interceptor redirigira al login
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, [get]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const login = useCallback(
    async (credentials: Credentials) => {
      const { user: loggedInUser, token: newToken } = await post<
        AuthSession,
        Credentials
      >("/auth/login", credentials);

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(loggedInUser);
    },
    [post]
  );

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem("token");
    // window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
