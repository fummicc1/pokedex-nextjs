import { Sprites } from "./sprites";
import { PokemonType } from "./type";

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  sprites: Sprites | undefined;
  types: PokemonType[];
}

export interface PokemonPartialInfo {
  name: string;
  url: string;
}
