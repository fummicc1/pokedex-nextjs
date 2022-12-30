import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Button, Flex, HStack } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <Flex>
            <HStack spacing={"2"}>
              <p>
                Get started by editing&nbsp;
                <code className={styles.code}>pages/index.tsx</code>
              </p>
              <Link href="/pokemons">
                <Button>Show Pokemons</Button>
              </Link>
            </HStack>
          </Flex>
        </div>
      </main>
    </>
  );
}