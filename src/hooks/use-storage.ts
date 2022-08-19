import { useAuth } from "./use-auth";
import { Storage } from "@stacks/storage";

export const useStorage = () => {
  const { userSession } = useAuth();

  const storage = new Storage({ userSession });

  const saveFile = async (
    filename: string,
    data: any,
    isPublic: boolean = false
  ) => {
    try {
      const url = await storage.putFile(
        filename,
        JSON.stringify({ data, isPublic }),
        {
          encrypt: !isPublic,
          dangerouslyIgnoreEtag: true,
        }
      );

      return url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const getFile = async (filename: string) => {
    try {
      const res = await storage.getFile(filename, { decrypt: false });

      if (res) {
        const json = JSON.parse(res as string);

        console.log(json);

        if (json.isPublic) {
          return json;
        } else {
          const decrypted = await userSession.decryptContent(res as string);
          const decryptedJSON = JSON.parse(decrypted as string);
          return decryptedJSON;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { storage, saveFile, getFile };
};
