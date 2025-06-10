// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { login } from "./authThunks";
import type { RootState } from "../../app/store";
import type { User } from "../../types/auth";

interface AuthState {
  accessToken: string | null;
  user: User | null
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

export const selectCurrentToken = (state: RootState) => state.auth.accessToken
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentRoles = (state: RootState) => state.auth.user?.roles || [];