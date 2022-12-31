import { NextApiRequest, NextApiResponse } from "next";
import { Pokemon, PokemonPartialInfo } from "../../data/pokemon";
import { pokeAPIBaseURL } from "../../domain/const";

interface ResponseData {
  results: PokemonPartialInfo[];
  next: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pokemon[]>
) {
  const { offset, limit } = req.query;
  let endpoint = `${pokeAPIBaseURL}/pokemon?limit=${limit || "10"}&offset=${
    offset || "0"
  }`;
  const response = await fetch(endpoint);
  const data: ResponseData = await response.json();
  const urls = data.results.map((result) => result.url);
  const pokemons: Promise<Pokemon>[] = urls.map(
    async (url) => await (await fetch(url)).json()
  );
  const results = await Promise.all(pokemons);
  res.status(200).json(results);
}
