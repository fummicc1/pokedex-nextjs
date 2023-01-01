import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PokemonsState {
  savedPokemonIDList: number[];
}

const initialState: PokemonsState = {
  savedPokemonIDList: [],
};

export const pokemonsSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    toggleSaveStatus: (state, action: PayloadAction<number>) => {
      const isCurrentlySaved = state.savedPokemonIDList.includes(
        action.payload
      );
      if (isCurrentlySaved) {
        state.savedPokemonIDList = state.savedPokemonIDList.filter(
          (id) => id != action.payload
        );
      } else {
        state.savedPokemonIDList.push(action.payload);
      }
    },
  },
});

export const { toggleSaveStatus } = pokemonsSlice.actions;
export default pokemonsSlice.reducer;
