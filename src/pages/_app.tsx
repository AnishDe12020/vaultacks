import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, chakra, Center } from "@chakra-ui/react";
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
      <Center mt={8} flexDir="column" px={{ base: 8, md: 16, lg: 32 }}>
        <Component {...pageProps} />
      </Center>
    </ChakraProvider>
  );
}

export default MyApp;
