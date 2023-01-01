import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
});

export const {} = accountSlice.actions;
export default accountSlice.reducer;
