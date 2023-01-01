import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./account/accountSlice";
import pokemonsSlice from "./pokemons/pokemonsSlice";

export const store = configureStore({
  reducer: {
    pokemons: pokemonsSlice,
    account: accountSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
