import { Button, Center, Flex, Heading, Link, Spacer } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAuth } from "@/hooks/use-auth";
import Files from "@/components/Files";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <Center mt={8} as={Flex} flexDir="column">
      <Heading mr={8}>Vaultacks</Heading>

      <Spacer my={8} />

      <NextLink href="/upload" passHref>
        <Button as={Link}>Upload Files</Button>
      </NextLink>

      <Files />
    </Center>
  );
};

export default Home;
