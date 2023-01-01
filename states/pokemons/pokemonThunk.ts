import { createAsyncThunk } from "@reduxjs/toolkit";
import { Pokemon } from "../../data/pokemon";
import { AppDispatch, AppState } from "../store";
import { setShouldLoggedIn } from "./pokemonsSlice";

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
  boolean,
  number,
  { state: AppState; dispatch: AppDispatch }
>("pokemons/savePokemonID", async (id: number, { getState, dispatch }) => {
  const { account } = getState();
  if (!account.isLoggedIn) {
    dispatch(setShouldLoggedIn());
    return false;
  }
  return true;
});
