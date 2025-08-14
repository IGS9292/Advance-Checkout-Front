// store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "../services/AuthService";
const baseURL = import.meta.env.VITE_API_BASE as string;

interface AuthState {
  user: Omit<import("../contexts/AuthContext").User, "token"> | null;
  accessToken: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false
};

export const login = createAsyncThunk(
  `${baseURL}/auth/login`,
  async (credentials: { email: string; password: string; token: string }) => {
    const data = await loginUser(credentials);
    return {
      user: data.user,
      token: data.accessToken
    };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: any; token: string }>) => {
          state.user = action.payload.user;
          state.accessToken = action.payload.token;
          state.loading = false;
        }
      )
      .addCase(login.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { logout, setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer;
