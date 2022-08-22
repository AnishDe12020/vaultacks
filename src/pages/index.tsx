import { Button, Center, Flex, Heading, Link, Spacer } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAuth } from "@/hooks/use-auth";
import Files from "@/components/Files";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <NextLink href="/upload" passHref>
        <Button as={Link}>Upload Files</Button>
      </NextLink>

      <Files />
    </>
  );
};

export default Home;
