// src/hooks/useAxiosPrivate.ts
import { useEffect } from "react";
import {api, axiosPublic} from "../api/axios"; // instancia con interceptores
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { setCredentials, logOut } from "../features/auth/authSlice";
import { selectCurrentToken, selectCurrentRoles } from "../features/auth/authSlice";
import { AxiosError, type InternalAxiosRequestConfig,  } from "axios";

const useAxiosPrivate = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectCurrentToken);
  const roles = useAppSelector(selectCurrentRoles);

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.headers["Authorization"] && accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const prevRequest = error?.config as any;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            // Usamos instancia sin interceptores
            const res = await axiosPublic.get("/auth/refresh");
            const { accessToken: newAccessToken, roles: newRoles } = res.data.data;

            dispatch(setCredentials({ accessToken: newAccessToken, roles: newRoles }));

            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api(prevRequest);
          } catch (err) {
            dispatch(logOut());
            return Promise.reject(err);
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
