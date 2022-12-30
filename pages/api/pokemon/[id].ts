import { NextApiRequest, NextApiResponse } from "next";
import { Pokemon } from "../../../data/pokemon";
import { pokeAPIBaseURL } from "../../../domain/const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pokemon>
) {
  const limit = 1;
  const { id } = req.query;
  const endpoint = `${pokeAPIBaseURL}/pokemon/${id}?limit=${limit}`;
  const response = await fetch(endpoint, {
    method: "GET",
  });
  const data = await response.json();
  res.status(200).json(data);
}
