import { NextApiRequest, NextApiResponse } from "next";
import { Pokemon, PokemonPartialInfo } from "../../data/pokemon";
import { pokeAPIBaseURL } from "../../domain/const";

interface ResponseData {
  results: PokemonPartialInfo[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pokemon[]>
) {
  const limit = 10;
  const endpoint = `${pokeAPIBaseURL}/pokemon?limit=${limit}`;
  const response = await fetch(endpoint);
  const data: ResponseData = await response.json();
  const urls = data.results.map((result) => result.url);
  const pokemons: Promise<Pokemon>[] = urls.map(
    async (url) => await (await fetch(url)).json()
  );
  const results = await Promise.all(pokemons);
  res.status(200).json(results);
}
