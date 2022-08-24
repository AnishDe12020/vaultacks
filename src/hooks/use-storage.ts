import { useAuth } from "./use-auth";
import { Storage } from "@stacks/storage";
import { MetadataFile } from "@/types/storage";
import { useState } from "react";
import useLoading from "./use-loading";
import { useToast } from "@chakra-ui/react";

const METADATA_FILE_PATH = ".vaultacks/metadata.json";

export const useStorage = () => {
  const { userSession } = useAuth();
  const [metadata, setMetadata] = useState<MetadataFile | undefined>();
  const {
    isLoading: isMetadataRefreshing,
    startLoading: startMetadataRefreshingLoading,
    stopLoading: stopMetadataRefreshingLoading,
  } = useLoading();
  const toast = useToast();

  console.log(
    "metadata",
    metadata && metadata.files && Object.keys(metadata?.files).length,
    metadata
  );

  const storage = new Storage({ userSession });

  const refreshMetadata = async () => {
    startMetadataRefreshingLoading();
    try {
      const res = await getMetadataFile();
      setMetadata(res);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error fetching files",
        description:
          "Something went wrong when fetching the files. Please try again later",
        status: "error",
      });
    }
    stopMetadataRefreshingLoading();
  };

  const saveFile = async (
    path: string,
    data: any,
    isPublic: boolean = false,
    isString: boolean = true
  ) => {
    const existingMetadata = await getMetadataFile();

    const url = await storage.putFile(path, data, {
      encrypt: !isPublic,
      cipherTextEncoding: "base64",
      dangerouslyIgnoreEtag: true,
      wasString: isString,
    });

    const currentFileMetadata = {
      path,
      isPublic,
      lastModified: new Date().toISOString(),
      url,
      isString,
    };

    if (existingMetadata) {
      const newMetadata: MetadataFile = existingMetadata;
      if (existingMetadata.files) {
        newMetadata.files = {
          ...existingMetadata.files,
          [path]: currentFileMetadata,
        };
      }

      await saveMetadataFile(newMetadata);
    } else {
      await saveMetadataFile({
        files: { [path]: currentFileMetadata },
      });
    }

    await refreshMetadata();

    return url;
  };

  const getFile = async (filename: string) => {
    try {
      const res = await storage.getFile(filename, { decrypt: false });

      if (res) {
        const json = JSON.parse(res as string);

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
    // console.log("getMetadataFile", metadata);
    if (!metadata) return null;
    return metadata;
  };

  const saveMetadataFile = async (metadata: any) => {
    await storage.putFile(METADATA_FILE_PATH, JSON.stringify(metadata), {
      encrypt: true,
      dangerouslyIgnoreEtag: true,
    });
  };

  const deleteFile = async (path: string) => {
    const existingMetadata = await getMetadataFile();

    const newMetadata: MetadataFile = {
      ...existingMetadata,
      files: { ...existingMetadata.files, [path]: undefined },
    };

    await saveMetadataFile(newMetadata);

    await storage.deleteFile(path);

    await refreshMetadata();
  };

  const deleteAllFiles = async () => {
    const paths: string[] = [];
    await storage.listFiles(path => {
      paths.push(path);
      return true;
    });

    for (const path of paths) {
      await storage.deleteFile(path);
      console.log(`delete ${path}`);
    }
  };

  return {
    storage,
    saveFile,
    getFile,
    getMetadataFile,
    saveMetadataFile,
    deleteFile,
    deleteAllFiles,
    metadata,
    refreshMetadata,
    isMetadataRefreshing,
  };
};
