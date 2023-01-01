import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Pokemon } from "../../data/pokemon";
import { fetchPokemons, savePokemonID } from "./pokemonThunk";

export interface PokemonsState {
  savedPokemonIDList: number[];
  fetchedPokemons: Pokemon[];
  filteredPokemons: Pokemon[];
  searchWord: string;
  listOffset: number;
  isSetuped: boolean;
  isLoading: boolean;
  shouldLoggedIn: boolean;
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
  shouldLoggedIn: false,
  errorMessage: null,
};

export const pokemonsSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    setSavedPokemonIDList: (state, action: PayloadAction<number[]>) => {
      state.savedPokemonIDList = action.payload;
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
    setShouldLoggedIn: (state) => {
      state.shouldLoggedIn = true;
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
    builder.addCase(savePokemonID.fulfilled, (state, action) => {
      const { result, id } = action.payload;
      if (result && id) {
        state.savedPokemonIDList.push(id);
      } else {
        state.errorMessage = "保存に失敗しました。";
      }
    });
  },
});

export const {
  setSavedPokemonIDList,
  setShouldLoggedIn,
  startLoading,
  increaseOffset,
  setFilteredPokemons,
  finishedSetup,
  updateSearchWord,
} = pokemonsSlice.actions;
export default pokemonsSlice.reducer;
