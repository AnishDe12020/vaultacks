import { Button, Center, Flex, Heading, Link, Spacer } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAuth } from "@/hooks/use-auth";
import Files from "@/components/Files";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Heading>Files</Heading>

      <NextLink href="/upload" passHref>
        <Button my={8} as={Link}>
          Upload Files
        </Button>
      </NextLink>

      <Files />
    </>
  );
};

export default Home;
