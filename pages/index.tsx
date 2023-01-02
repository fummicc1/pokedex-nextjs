import Head from "next/head";
import { Inter } from "@next/font/google";
import Link from "next/link";
import { Button, Flex, HStack } from "@chakra-ui/react";
import PokemonListPage from "./pokemons";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <PokemonListPage />
    </>
  );
}
