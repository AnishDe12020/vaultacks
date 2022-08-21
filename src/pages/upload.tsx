import { Center, Flex, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import Upload from "components/Upload";

const Home: NextPage = () => {
  return (
    <Center mt={8} as={Flex} flexDir="column">
      <Heading>Upload Files</Heading>

      <Upload />
    </Center>
  );
};

export default Home;
