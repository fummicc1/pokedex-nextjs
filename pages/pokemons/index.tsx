import { Pokemon, PokemonPartialInfo } from "../../data/pokemon";
import useSWR, { Fetcher } from "swr";
import PokemonSimpleCard from "../../ui-components/simple_card";
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Input,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useState, ChangeEventHandler, useEffect } from "react";
import {
  finishedSetup,
  increaseOffset,
  removePokemonFromStorage,
  setFilteredPokemons,
  startLoading,
  storePokemonToStorage,
  updateSearchWord,
} from "../../states/pokemons/pokemonsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@chakra-ui/react";
import { AppDispatch, AppState } from "../../states/store";
import {
  fetchPokemons,
  savePokemonID,
} from "../../states/pokemons/pokemonThunk";
import { ThunkAction, ThunkDispatch, unwrapResult } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";
import { checkIsLoggedIn } from "../../states/account/accountThunk";

const filterByName = (pokemons: Pokemon[], name: string): Pokemon[] =>
  pokemons.filter((pokemon) => pokemon.name.includes(name));

export default function PokemonListPage() {
  const state = useSelector((state: AppState) => state.pokemons);
  const isLoggedIn = useSelector((state: AppState) => state.account.isLoggedIn);
  const dispatch = useDispatch<AppDispatch>();
  const shouldLoggedIn = state.shouldLoggedIn;
  const offset = state.listOffset;
  const isLoading = state.isLoading;
  const limit = 10;
  const initialMinimumPokemonCount = 90;
  const isSetuped = state.isSetuped;
  const fetchedPokemons = state.fetchedPokemons;
  const filteredPokemons = state.filteredPokemons;
  const searchWord = state.searchWord;

  useEffect(() => {
    if (searchWord.length === 0) {
      dispatch(setFilteredPokemons(fetchedPokemons));
      return;
    }
    const newPokemonList = filterByName(fetchedPokemons, searchWord);
    dispatch(setFilteredPokemons(newPokemonList));
  }, [searchWord, fetchedPokemons, dispatch]);

  useEffect(() => {
    console.log("start fetch");
    dispatch(startLoading());
    dispatch(fetchPokemons(limit));
  }, [offset, dispatch]);

  useEffect(() => {
    dispatch(checkIsLoggedIn());
  });

  useEffect(() => {
    if (!isSetuped) {
      if (!isLoading) {
        console.log("can start loading new pokemons.");
        if (offset < initialMinimumPokemonCount) {
          dispatch(increaseOffset(10));
        } else {
          dispatch(finishedSetup());
        }
      } else {
        console.log("waiting to start loading new pokemons.");
      }
    }
  }, [isSetuped, isLoading, offset, dispatch, fetchedPokemons]);

  useEffect(() => {
    // try dynamic import
    import("firebaseui").then((firebaseui) => {
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", {
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod:
              firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
          },
        ],
      });
    });
  }, []);

  const loadingElement = (size: number, fontSize: number) => (
    <CircularProgress isIndeterminate size={size} color={"gray"}>
      <CircularProgressLabel fontSize={fontSize} fontWeight="medium">
        Loading...
      </CircularProgressLabel>
    </CircularProgress>
  );

  const loginElement = (
    <Stack
      spacing={2}
      padding={2}
      hidden={!shouldLoggedIn}
      borderRadius="md"
      border={"1px"}
      borderTop="hidden"
      borderLeft="hidden"
      borderRight="hidden"
      borderColor="ActiveBorder"
    >
      <Text fontSize="2xl" color={"red.300"} fontWeight="medium">
        Account is necessary to save pokemon you choose.
      </Text>
      <Flex
        align={"center"}
        justify={"stretch"}
        id="firebaseui-auth-container"
        width={"100vw"}
      ></Flex>
    </Stack>
  );

  if (!state.isSetuped) {
    return (
      <Stack spacing={"2"} padding="2">
        {loginElement}
        <Flex
          align={"center"}
          justify={"center"}
          height={"100vh"}
          width={"100vw"}
        >
          {loadingElement(32, 16)}
        </Flex>
      </Stack>
    );
  }

  const contents = filteredPokemons.map((pokemon) => (
    <PokemonSimpleCard
      pokemon={pokemon}
      key={pokemon.id}
      onClickSaveButton={(pokemon) => {
        const isStored = fetchedPokemons
          .map((pokemon) => pokemon.id)
          .includes(pokemon.id);
        if (isStored) {
          dispatch(savePokemonID(pokemon.id));
        } else {
          dispatch(removePokemonFromStorage(pokemon.id));
        }
      }}
    />
  ));
  return (
    <Stack spacing={"2"} padding="2">
      {loginElement}
      <Input
        placeholder="Search pokemon by name"
        onChange={(event) => dispatch(updateSearchWord(event.target.value))}
      ></Input>
      <SimpleGrid minChildWidth={160}>{contents}</SimpleGrid>
      <Button onClick={() => dispatch(increaseOffset(10))}>
        Load next pokemons...
      </Button>
    </Stack>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
