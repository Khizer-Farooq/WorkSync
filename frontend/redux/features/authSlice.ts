import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/lib/constants";
import type { User } from "@/types/auth";

type AuthState = {
  token: string | null;
  user: User | null;
};

const initialState: AuthState = {
  token:
    typeof window !== "undefined"
      ? Cookies.get(TOKEN_KEY) || null
      : null,

  user: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      Cookies.set(
        TOKEN_KEY,
        action.payload.token,
        {
          expires: 7,
          sameSite: "lax",
        }
      );
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      Cookies.remove(TOKEN_KEY);
    },
  },
});

export const { setCredentials, logout } =
  authSlice.actions;

export default authSlice.reducer;