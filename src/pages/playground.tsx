import { useStorage } from "@/hooks/use-storage";
import { Alert, Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";

const PlaygroundPage: NextPage = () => {
  const { saveFile, getFile, storage, deleteAllFiles } = useStorage();

  const [filename, setFilename] = useState<string | null>(null);

  return (
    <Box px={16} py={16}>
      <Heading>Vaultacks Playground</Heading>
      <Alert status="warning" mt={4}>
        ⚠️ This playground lets you perform actions that may be destructive to
        your data. Please use this only if you know what you are doing
      </Alert>
      <Alert status="info" mt={4}>
        ℹ️ All output is only to the console
      </Alert>

      <Flex experimental_spaceX={4} py={8}>
        <Button
          onClick={async () =>
            console.log(await saveFile(`test-encrypted.txt`, "encrypted text"))
          }
        >
          Save encrypted file
        </Button>

        <Button
          onClick={async () =>
            console.log(
              await saveFile(`test-decrypted.txt`, "decrypted text", true)
            )
          }
        >
          Save public file
        </Button>

        <Button
          onClick={async () => {
            await storage.listFiles(name => {
              console.log(name);
              return true;
            });
          }}
        >
          List Files
        </Button>

        <Button
          onClick={async () => {
            await deleteAllFiles();
            console.log("deleted all");
          }}
        >
          Delete all files
        </Button>
      </Flex>

      <form
        onSubmit={async e => {
          e.preventDefault();
          console.log(await getFile(filename as string));
        }}
      >
        <Flex direction="row" experimental_spaceX={4}>
          <Input
            name="filename"
            required
            onChange={e => setFilename(e.target.value as string)}
          />{" "}
          <Button type="submit">Get File</Button>
        </Flex>
      </form>
    </Box>
  );
};

export default PlaygroundPage;
