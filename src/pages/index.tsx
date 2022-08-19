import { Button, Center, Heading, Input, Textarea } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAuth } from "@/hooks/use-auth";
import { useStorage } from "@/hooks/use-storage";
import { useState } from "react";

const Home: NextPage = () => {
  const { authenticate, logout, userData } = useAuth();
  const { saveFile, getFile, storage } = useStorage();

  const [filename, setFilename] = useState<string | null>(null);

  console.log(userData);

  return (
    <Center>
      <Heading>Vaultacks</Heading>
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
        Save decrypted file
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
    </Center>
  );
};

export default Home;
