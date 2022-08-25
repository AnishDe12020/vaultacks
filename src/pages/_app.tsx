import "../../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ChakraProvider,
  Text,
  Center,
  Button,
  Heading,
  Link,
  Icon,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { LogIn } from "react-feather";
import { theme } from "../theme";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  const { userSession, setUserData, authenticate, userData } = useAuth();

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
        {userData ? (
          <Component {...pageProps} />
        ) : (
          <>
            <Heading>Vaultacks</Heading>
            <Text as="h2" fontSize="xl" textAlign="center" mt={4} mb={16}>
              Vaultacks stores your data off-chain using{" "}
              <Link
                href="https://docs.stacks.co/docs/gaia/"
                isExternal
                color="blue.400"
              >
                Gaia
              </Link>
              . Files our encrypted by default and can only be decrypted by your
              wallet. You can also store public files, which will be stored in
              an unencrypted form.
            </Text>

            <Text fontSize="xl">Please connect your wallet to continue</Text>
            <Button
              mt={4}
              onClick={authenticate}
              bg="blue.600"
              color="white"
              _hover={{ bg: "blue.500" }}
              leftIcon={<Icon as={LogIn} />}
            >
              Connect Wallet
            </Button>
          </>
        )}
      </Center>
    </ChakraProvider>
  );
}

export default MyApp;
