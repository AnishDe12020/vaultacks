import { Link, VStack, Text } from "@chakra-ui/react";

const Footer = () => (
  <VStack as="footer" alignItems="center" justify="center" spacing={4} mt={32}>
    <Text>
      Made by{" "}
      <Link href="https://twitter.com/AnishDe12020" isExternal color="blue.400">
        Anish De
      </Link>
    </Text>

    <Text>
      The code for this is open-source,{" "}
      <Link
        href="https://github.com/AnishDe12020/vaultacks"
        isExternal
        color="blue.400"
      >
        AnishDe12020/vaultacks
      </Link>
    </Text>
  </VStack>
);

export default Footer;
