// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { login } from "./authThunks";

interface AuthState {
  accessToken: string | null;
  user: any; // cambia esto por un tipo adecuado si lo tienes
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user; // si el backend devuelve info del usuario
    });
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
