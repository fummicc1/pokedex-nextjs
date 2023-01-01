import { createAsyncThunk } from "@reduxjs/toolkit";
import { Pokemon } from "../../data/pokemon";
import { AppDispatch, AppState } from "../store";
import { setSavedPokemonIDList, setShouldLoggedIn } from "./pokemonsSlice";
import "firebase/compat/firestore";
import { firebaseApp } from "../../pages/_app";
import { User } from "../../data/user";

export const fetchPokemons = createAsyncThunk<
  Pokemon[],
  number,
  { state: AppState; dispatch: AppDispatch }
>("pokemons/fetchPokemons", async (limit: number, { getState }) => {
  console.log("called fetchPokemons function");
  const { listOffset } = getState().pokemons;
  const res = await fetch(`/api/pokemons?limit=${limit}&offset=${listOffset}`);
  const newPokemons = res.json();
  return newPokemons;
});

export const savePokemonID = createAsyncThunk<
  { result: boolean; id: number | null },
  number,
  { state: AppState; dispatch: AppDispatch }
>("pokemons/savePokemonID", async (id: number, { getState, dispatch }) => {
  const { pokemons, account } = getState();
  const { uid, isLoggedIn } = account;
  if (!isLoggedIn || !uid) {
    dispatch(setShouldLoggedIn());
    return { result: false, id: null };
  }
  const newSavedPokemonIDList = [...pokemons.savedPokemonIDList, id];
  try {
    await firebaseApp
      .firestore()
      .collection("users")
      .doc(uid)
      .set({ savedPokemonIDList: newSavedPokemonIDList });
    return { result: true, id: id };
  } catch (e) {
    console.error(e);
    return { result: false, id: null };
  }
});

export const observeUserInfoChange = createAsyncThunk<
  void,
  string,
  { state: AppState; dispatch: AppDispatch }
>("pokemons/observeUserInfoChange", async (uid: string, { dispatch }) => {
  firebaseApp
    .firestore()
    .collection("users")
    .doc(uid)
    .onSnapshot({
      next: (snapshots) => {
        const data = snapshots.data();
        if (!data) {
          return;
        }
        const savedPokemonIDList = data["savedPokemonIDList"];
        dispatch(setSavedPokemonIDList(savedPokemonIDList));
      },
    });
});
