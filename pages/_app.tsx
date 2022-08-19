import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";
import { useEffect } from "react";
import { useAuth } from "../src/hooks/use-auth";

function MyApp({ Component, pageProps }: AppProps) {
  const { userSession, setUserData } = useAuth();

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      // setLoggedIn(true);
      setUserData(userSession.loadUserData());
    }
  }, [userSession, setUserData]);

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
