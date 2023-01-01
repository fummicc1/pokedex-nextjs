import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { checkIsLoggedIn } from "./accountThunk";

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
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setUid: (state, action: PayloadAction<string>) => {
      state.uid = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkIsLoggedIn.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload;
    });
  },
});

export const {} = accountSlice.actions;
export default accountSlice.reducer;
