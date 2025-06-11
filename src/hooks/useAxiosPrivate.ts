// src/hooks/useAxiosPrivate.ts
import { useEffect } from "react";
import api from "../api/axios";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { setCredentials, logOut } from "../features/auth/authSlice";
import { AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const useAxiosPrivate = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const roles = useAppSelector((state) => state.auth.roles)

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (accessToken && !config.headers?.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const prevRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (
          error.response?.status === 403 &&
          !prevRequest._retry
        ) {
          prevRequest._retry = true;
          try {
            const refreshResponse = await api.get("/auth/refresh");
            const newAccessToken = refreshResponse.data.accessToken;
            const newRoles = refreshResponse.data.roles;

            dispatch(setCredentials({ accessToken: newAccessToken, roles: newRoles}));
            if (prevRequest.headers) {
              prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            }

            return api(prevRequest);
          } catch (refreshError) {
            dispatch(logOut());
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, dispatch, roles]);

  return api;
};

export default useAxiosPrivate;
