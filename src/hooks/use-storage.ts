import { useAuth } from "./use-auth";
import { Storage } from "@stacks/storage";

const METADATA_FILE_PATH = ".vaultacks/metadata.json";

export const useStorage = () => {
  const { userSession } = useAuth();

  const storage = new Storage({ userSession });

  const saveFile = async (
    path: string,
    data: any,
    isPublic: boolean = false
  ) => {
    const existingMetadata = await getMetadataFile();

    if (existingMetadata) {
      const newMetadata = {
        ...existingMetadata,
        [path]: {
          isPublic,
          lastModified: new Date().toISOString(),
        },
      };

      await saveMetadataFile(newMetadata);
    } else {
      await saveMetadataFile({
        [path]: {
          isPublic,
          lastModified: new Date().toISOString(),
        },
      });
    }

    const url = await storage.putFile(path, data, {
      encrypt: !isPublic,
      dangerouslyIgnoreEtag: true,
    });

    return url;
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

  const getMetadataFile = async () => {
    const metadata = await getFile(METADATA_FILE_PATH);
    console.log("getMetadataFile", metadata);
    if (!metadata) return null;
    return metadata;
  };

  const saveMetadataFile = async (metadata: any) => {
    await storage.putFile(METADATA_FILE_PATH, JSON.stringify(metadata), {
      encrypt: true,
      dangerouslyIgnoreEtag: true,
    });
  };

  return { storage, saveFile, getFile };
};
