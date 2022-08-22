import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, chakra } from "@chakra-ui/react";
import { theme } from "../theme";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  const { userSession, setUserData } = useAuth();

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, [userSession, setUserData]);

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <chakra.main px={{ base: 8, md: 16, lg: 32 }}>
        <Component {...pageProps} />
      </chakra.main>
    </ChakraProvider>
  );
}

export default MyApp;
