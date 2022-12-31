import { Pokemon, PokemonPartialInfo } from "../../data/pokemon";
import useSWR, { Fetcher } from "swr";
import PokemonSimpleCard from "../../ui-components/simple_card";
import {
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
  const fetcher: Fetcher<Pokemon[], string> = async (endpoint) => {
    const response = await fetch(endpoint);
    return await response.json();
  };
  const { data, error } = useSWR("/api/pokemons", fetcher);
  const initialList = data;
  const [searchWord, setSearchWord] = useState("");
  const [pokemons, setPokemons] = useState(initialList);
  useEffect(() => {
    if (searchWord.length === 0) {
      setPokemons(initialList);
      return;
    }
    if (!initialList) {
      return;
    }
    const newPokemonList = filterByName(initialList, searchWord);
    setPokemons(newPokemonList);
  }, [searchWord, initialList]);

  if (!initialList || !pokemons) {
    return (
      <Flex
        align={"center"}
        justify={"center"}
        height={"100vh"}
        width={"100vw"}
      >
        <CircularProgress isIndeterminate size={32} color={"gray"}>
          <CircularProgressLabel fontSize={16} fontWeight="medium">
            Loading...
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>
    );
  }

  const contents = pokemons.map((pokemon) => (
    <PokemonSimpleCard pokemon={pokemon} key={pokemon.id} />
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
      <SimpleGrid minChildWidth={"120px"}>{contents}</SimpleGrid>
    </Stack>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
