import { createAsyncThunk } from "@reduxjs/toolkit";
import { Pokemon } from "../../data/pokemon";
import { AppDispatch, AppState } from "../store";

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
