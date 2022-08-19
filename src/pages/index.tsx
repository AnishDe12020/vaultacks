import { Button, Center, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAuth } from "@/hooks/use-auth";

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
