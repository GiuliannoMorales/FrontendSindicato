import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }) => {
    const response = await api.post("/auth", credentials);
    return response.data; // { accessToken, ... }
  }
);
