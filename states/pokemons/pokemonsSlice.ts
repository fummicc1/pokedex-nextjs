import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Pokemon } from "../../data/pokemon";
import { fetchPokemons } from "./pokemonThunk";

export interface PokemonsState {
  savedPokemonIDList: number[];
  fetchedPokemons: Pokemon[];
  filteredPokemons: Pokemon[];
  searchWord: string;
  listOffset: number;
  isSetuped: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

const initialState: PokemonsState = {
  savedPokemonIDList: [],
  fetchedPokemons: [],
  filteredPokemons: [],
  searchWord: "",
  listOffset: 0,
  isSetuped: false,
  isLoading: false,
  errorMessage: null,
};

export const pokemonsSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    storePokemonToStorage: (state, action: PayloadAction<number>) => {
      state.savedPokemonIDList.push(action.payload);
    },
    removePokemonFromStorage: (state, action: PayloadAction<number>) => {
      state.savedPokemonIDList = state.savedPokemonIDList.filter(
        (id) => id != action.payload
      );
    },
    increaseOffset: (state, action: PayloadAction<number>) => {
      state.listOffset += action.payload;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    finishedSetup: (state) => {
      state.isSetuped = true;
    },
    updateSearchWord: (state, action: PayloadAction<string>) => {
      state.searchWord = action.payload;
    },
    setFilteredPokemons: (state, action: PayloadAction<Pokemon[]>) => {
      state.filteredPokemons = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPokemons.fulfilled, (state, action) => {
      console.log("fetchPokemons is fulfilled.");
      state.fetchedPokemons.push(...action.payload);
      state.fetchedPokemons.sort((a, b) => a.id - b.id);
      state.errorMessage = null;
      state.isLoading = false;
    });
  },
});

export const {
  storePokemonToStorage,
  removePokemonFromStorage,
  startLoading,
  increaseOffset,
  setFilteredPokemons,
  finishedSetup,
  updateSearchWord,
} = pokemonsSlice.actions;
export default pokemonsSlice.reducer;
