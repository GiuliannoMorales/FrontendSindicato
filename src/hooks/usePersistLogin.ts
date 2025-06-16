import { useEffect, useState } from "react";
import { selectCurrentToken, setCredentials } from "../features/auth/authSlice";
import api from "../api/axios";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const usePersistLogin = () => {
  const token = useAppSelector(selectCurrentToken);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const response = await api.get("/auth/refresh");
        const { accessToken, roles } = response.data.data;
        console.log('Refreshed token', response.data.data)
        dispatch(setCredentials({ accessToken, roles }));
      } catch (err) {
        console.error("No se pudo renovar el token:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!token) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
    
  }, [token, dispatch]);

  return isLoading;
};

export default usePersistLogin;
