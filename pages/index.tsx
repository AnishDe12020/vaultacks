import { Button, Center, Heading } from "@chakra-ui/react";
import { lchown } from "fs";
import type { NextPage } from "next";
import { useAuth } from "../src/hooks/use-auth";

const Home: NextPage = () => {
  const { authenticate, logout, userData } = useAuth();

  console.log(userData);

  return (
    <Center>
      <Heading>Vaultacks</Heading>
      {userData ? (
        <Button onClick={logout}>Sign Out</Button>
      ) : (
        <Button onClick={authenticate}>Sign In</Button>
      )}
    </Center>
  );
};

export default Home;
