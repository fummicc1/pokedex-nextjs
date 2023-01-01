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

const filterByName = (pokemons: Pokemon[], name: string): Pokemon[] =>
  pokemons.filter((pokemon) => pokemon.name.includes(name));

export default function PokemonListPage() {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const initialMinimumPokemonCount = 90;
  const [isSetup, setIsSetup] = useState(true);
  const [initialList, setInitialList] = useState<Pokemon[]>([]);
  const [searchWord, setSearchWord] = useState("");
  initialList.sort((a, b) => a.id - b.id);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    if (searchWord.length === 0) {
      setPokemons(initialList);
      return;
    }
    const newPokemonList = filterByName(initialList, searchWord);
    setPokemons(newPokemonList);
  }, [searchWord, initialList]);

  useEffect(() => {
    fetch(`/api/pokemons?limit=${limit}&offset=${offset}`).then((res) =>
      res.json().then((newPokemons) => {
        setInitialList((prev) => [...prev, ...newPokemons]);
      })
    );
  }, [offset]);

  useEffect(() => {
    if (isSetup) {
      if (offset == initialList.length) {
        if (offset < initialMinimumPokemonCount) {
          setOffset(offset + 10);
        } else {
          setIsSetup(false);
        }
      }
    }
  }, [isSetup, offset, initialList]);

  const loadingElement = (size: number, fontSize: number) => (
    <CircularProgress isIndeterminate size={size} color={"gray"}>
      <CircularProgressLabel fontSize={fontSize} fontWeight="medium">
        Loading...
      </CircularProgressLabel>
    </CircularProgress>
  );

  if (initialList.length < initialMinimumPokemonCount) {
    return (
      <Flex
        align={"center"}
        justify={"center"}
        height={"100vh"}
        width={"100vw"}
      >
        {loadingElement(32, 16)}
      </Flex>
    );
  }

  const contents = pokemons.map((pokemon) => (
    <PokemonSimpleCard
      pokemon={pokemon}
      key={pokemon.id}
      onClickSaveButton={(pokemon) => {
        alert(
          "Nice action! but please memorize by yourself until save feature is implemented."
        );
      }}
    />
  ));
  const onChangeSearchWord: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchWord(event.target.value);
  };
  return (
    <Stack spacing={"2"} padding="2">
      <Input
        placeholder="Search pokemon by name"
        onChange={onChangeSearchWord}
      ></Input>
      <SimpleGrid minChildWidth={160}>{contents}</SimpleGrid>
      <Button onClick={() => setOffset(10 + offset)}>
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
