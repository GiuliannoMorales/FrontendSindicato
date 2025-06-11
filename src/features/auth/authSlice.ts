// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { login } from "./authThunks";
import type { RootState } from "../../app/store";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null
  roles: Array<string>
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  roles: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logOut: (state) => {
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.accessToken
export const selectCurrentRoles = (state: RootState) => state.auth.roles || [];