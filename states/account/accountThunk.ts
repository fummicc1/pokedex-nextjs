import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseApp } from "../../pages/_app";
import { AppDispatch, AppState } from "../store";
import { getAuth } from "firebase/auth";

export const checkIsLoggedIn = createAsyncThunk<
  boolean,
  void,
  { state: AppState; dispatch: AppDispatch }
>("account/checkIsLoggedIn", async () => {
  const firebaseAuth = getAuth(firebaseApp);
  return firebaseAuth.currentUser != null;
});
