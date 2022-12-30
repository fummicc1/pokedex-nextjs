import {
  Card,
  CardBody,
  Stack,
  Text,
  Image,
  Box,
  CardHeader,
  Heading,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import { Pokemon } from "../data/pokemon";

type Props = {
  pokemon: Pokemon;
};

export default function PokemonSimpleCard({ pokemon }: Props) {
  const sprites = pokemon.sprites;
  let imageURL;
  if (!sprites) {
    imageURL = "";
  } else {
    imageURL = sprites.front_default;
  }
  return (
    <Card id={`${pokemon.id}`} align="center" size={"sm"}>
      <CardHeader>
        <Heading size={"md"}>{pokemon.name}</Heading>
      </CardHeader>
      <CardBody>
        <Image alt={`image of ${pokemon.name}`} src={imageURL || ""}></Image>
      </CardBody>
      <CardFooter>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}