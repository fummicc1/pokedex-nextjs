import { Pokemon, PokemonPartialInfo } from "../../data/pokemon";
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
import { useEffect } from "react";
import {
  finishedSetup,
  increaseOffset,
  setFilteredPokemons,
  startLoading,
  updateSearchWord,
} from "../../states/pokemons/pokemonsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@chakra-ui/react";
import { AppDispatch, AppState } from "../../states/store";
import {
  fetchPokemons,
  observeUserInfoChange,
  savePokemonID,
} from "../../states/pokemons/pokemonThunk";
import firebase from "firebase/compat/app";
import { checkAuthStatus } from "../../states/account/accountThunk";

const filterByName = (pokemons: Pokemon[], name: string): Pokemon[] =>
  pokemons.filter((pokemon) => pokemon.name.includes(name));

export default function PokemonListPage() {
  const { pokemons: pokemonsState, account: accountState } = useSelector(
    (state: AppState) => state
  );
  const { uid } = accountState;
  const savedPokemonIDList = pokemonsState.savedPokemonIDList;
  const dispatch = useDispatch<AppDispatch>();
  const shouldLoggedIn = pokemonsState.shouldLoggedIn;
  const offset = pokemonsState.listOffset;
  const isLoading = pokemonsState.isLoading;
  const limit = 10;
  const initialMinimumPokemonCount = 90;
  const isSetuped = pokemonsState.isSetuped;
  const fetchedPokemons = pokemonsState.fetchedPokemons;
  const filteredPokemons = pokemonsState.filteredPokemons;
  const searchWord = pokemonsState.searchWord;

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
    dispatch(checkAuthStatus());
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

  useEffect(() => {
    // observe change of user info
    if (uid) {
      dispatch(observeUserInfoChange(uid));
    }
  }, [uid, dispatch]);

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

  if (!pokemonsState.isSetuped) {
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
      isSaved={savedPokemonIDList.includes(pokemon.id)}
      key={pokemon.id}
      onClickSaveButton={(pokemon) => {
        const isStored = savedPokemonIDList.includes(pokemon.id);
        if (!isStored) {
          dispatch(savePokemonID(pokemon.id));
        } else {
          alert("this feature is not implemented yet.");
        }
      }}
    />
  ));
  return (
    <Stack spacing={"2"} padding="2">
      {loginElement}

      <Box top={0} position="sticky" zIndex={"sticky"} bgColor="Background">
        <Input
          placeholder="Search pokemon by name"
          onChange={(event) => dispatch(updateSearchWord(event.target.value))}
        ></Input>
      </Box>
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
