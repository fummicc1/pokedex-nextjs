import { store } from "../states/store";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import fb from "firebase/compat/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCD6evnmqNmPgxLCtiLPYu74YzSysRSyKU",
  authDomain: "pokedex-samples.firebaseapp.com",
  projectId: "pokedex-samples",
  storageBucket: "pokedex-samples.appspot.com",
  messagingSenderId: "609730493956",
  appId: "1:609730493956:web:51030cfc9594297e0ebf51",
  measurementId: "G-Y8462NWYD6",
};

export const firebaseApp = !fb.apps.length
  ? fb.initializeApp(firebaseConfig)
  : fb.app();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}
