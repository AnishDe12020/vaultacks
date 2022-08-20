import { Button, Center, Flex, Heading, Input, Spacer } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAuth } from "@/hooks/use-auth";
import { useStorage } from "@/hooks/use-storage";
import { useState } from "react";
import Upload from "components/Upload";
import Files from "@/components/Files";

const Home: NextPage = () => {
  const { authenticate, logout, userData } = useAuth();
  const { saveFile, getFile, storage, deleteAllFiles } = useStorage();

  const [filename, setFilename] = useState<string | null>(null);

  return (
    <Center mt={8} as={Flex} flexDir="column">
      <Heading mr={8}>Vaultacks</Heading>
      {userData ? (
        <Button onClick={logout}>Sign Out</Button>
      ) : (
        <Button onClick={authenticate}>Sign In</Button>
      )}
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

      <form
        onSubmit={async e => {
          e.preventDefault();
          console.log(await getFile(filename));
        }}
      >
        <Input
          name="filename"
          required
          onChange={e => setFilename(e.target.value as string)}
        />{" "}
        <Button type="submit">Get File</Button>
      </form>

      <Spacer my={8} />

      <Upload />
      <Files />
    </Center>
  );
};

export default Home;
