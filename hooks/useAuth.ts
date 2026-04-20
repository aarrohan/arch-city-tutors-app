import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

type JWTPayload = {
  exp: number;
  id?: string;
  type?: string;
};

export default function useAuth() {
  const [checking, setChecking] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (token) {
          const decoded = jwtDecode<JWTPayload>(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp > currentTime) {
            setAuthenticated(true);
            setUserId(decoded.id ?? null);
            setUserType(decoded.type ?? null);
          } else {
            await SecureStore.deleteItemAsync("token");
            setAuthenticated(false);
            setUserId(null);
            setUserType(null);
          }
        } else {
          setAuthenticated(false);
          setUserId(null);
          setUserType(null);
        }
      } catch {
        setAuthenticated(false);
        setUserId(null);
        setUserType(null);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  return { checking, authenticated, userId, userType };
}
