import { Center, Flex, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import Upload from "components/Upload";

const Home: NextPage = () => {
  return (
    <>
      <Heading mb={8}>Upload Files</Heading>

      <Upload />
    </>
  );
};

export default Home;
