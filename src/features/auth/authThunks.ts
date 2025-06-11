import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const login = createAsyncThunk(
  "auth/signIn",
  async (credentials: { username: string; password: string }) => {
    try {
      const response = await api.post("/auth/signIn", credentials);
      return response.data; // { accessToken, ... }
    } catch (error) {
      console.log(error);
    }
  }
);
