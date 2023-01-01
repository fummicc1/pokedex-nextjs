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
  isSaved: boolean;
  onClickSaveButton: (pokemon: Pokemon) => void;
};

export default function PokemonSimpleCard({
  pokemon,
  isSaved,
  onClickSaveButton,
}: Props) {
  const sprites = pokemon.sprites;
  let imageURL;
  if (!sprites) {
    imageURL = "";
  } else {
    imageURL = sprites.front_default;
  }
  return (
    <Card id={`${pokemon.id}`} align="center">
      <CardHeader>
        <Heading fontWeight={"medium"} fontSize={"medium"}>
          {pokemon.name} / {pokemon.id}
        </Heading>
      </CardHeader>
      <CardBody>
        <Image alt={`image of ${pokemon.name}`} src={imageURL || ""}></Image>
      </CardBody>
      <CardFooter>
        <Button onClick={() => onClickSaveButton(pokemon)}>
          {isSaved ? "Unsave" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
