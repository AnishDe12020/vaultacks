import { Button, Heading, Link, Icon } from "@chakra-ui/react";
import type { NextPage } from "next";
import Files from "@/components/Files";
import NextLink from "next/link";
import { Upload } from "react-feather";

const Home: NextPage = () => {
  return (
    <>
      <Heading>Files</Heading>

      <NextLink href="/upload" passHref>
        <Link
          my={8}
          as={Button}
          leftIcon={<Icon as={Upload} />}
          _hover={{ textDecoration: "none" }}
        >
          Upload Files
        </Link>
      </NextLink>

      <Files />
    </>
  );
};

export default Home;
