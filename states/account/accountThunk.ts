import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseApp } from "../../pages/_app";
import { AppDispatch, AppState } from "../store";
import { getAuth } from "firebase/auth";
import { setEmail, setIsEmailVerified, setUid } from "./accountSlice";

export const checkAuthStatus = createAsyncThunk<
  boolean,
  void,
  { state: AppState; dispatch: AppDispatch }
>("account/checkAuthStatus", async (_, { dispatch }) => {
  const firebaseAuth = getAuth(firebaseApp);
  const { currentUser } = firebaseAuth;
  if (!currentUser) {
    dispatch(setUid(null));
    dispatch(setEmail(null));
    dispatch(setIsEmailVerified(false));
    return false;
  }
  const { email, emailVerified } = currentUser;
  dispatch(setUid(currentUser.uid));
  dispatch(setEmail(email));
  dispatch(setIsEmailVerified(emailVerified));
  return true;
});
