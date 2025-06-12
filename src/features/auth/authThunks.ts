import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const login = createAsyncThunk(
  "auth/signIn",
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post("/auth/signIn", credentials);

      return response.data;
    } catch (error: any) {
      console.log('errThunk', error)
      return thunkAPI.rejectWithValue(error?.response?.data || { message: "Login failed" });
    }
  }
);
