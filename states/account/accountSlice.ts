import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { checkAuthStatus } from "./accountThunk";

export interface AccountState {
  uid: string | null;
  email: string | null;
  isLoggedIn: boolean;
  isEmailVerified: boolean;
}

const initialState: AccountState = {
  uid: null,
  email: null,
  isLoggedIn: false,
  isEmailVerified: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setIsEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    setUid: (state, action: PayloadAction<string | null>) => {
      state.uid = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload;
    });
  },
});

export const { setUid, setEmail, setIsEmailVerified } = accountSlice.actions;
export default accountSlice.reducer;
