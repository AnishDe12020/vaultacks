import { Button, Center, Flex, Heading, Input, Spacer } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAuth } from "@/hooks/use-auth";
import Upload from "components/Upload";
import Files from "@/components/Files";

const Home: NextPage = () => {
  const { authenticate, logout, userData } = useAuth();

  return (
    <Center mt={8} as={Flex} flexDir="column">
      <Heading mr={8}>Vaultacks</Heading>
      {userData ? (
        <Button onClick={logout}>Sign Out</Button>
      ) : (
        <Button onClick={authenticate}>Sign In</Button>
      )}

      <Spacer my={8} />

      <Upload />
      <Files />
    </Center>
  );
};

export default Home;
