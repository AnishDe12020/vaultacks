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

  const getFileWithMeta = async (filename: string) => {
    const fileMeta = await getFileMetadata(filename);
    const res = await storage.getFile(filename, {
      decrypt: !fileMeta.isPublic,
    });

    return { meta: fileMeta, data: res };
  };

  const getFile = async (filename: string, doDecrypt: boolean = true) => {
    const res = await storage.getFile(filename, {
      decrypt: doDecrypt,
    });

    return res;
  };

  const getMetadataFile = async () => {
    try {
      const metadata = await storage.getFile(METADATA_FILE_PATH, {
        decrypt: true,
      });
      if (!metadata) return null;
      return JSON.parse(metadata as string);
    } catch (err) {
      console.error(err);
    }
  };

  const getFileMetadata = async (path: string) => {
    const metadata = await getMetadataFile();
    if (!metadata) return null;
    return metadata.files[path];
  };

  const saveMetadataFile = async (metadata: any) => {
    await storage.putFile(METADATA_FILE_PATH, JSON.stringify(metadata), {
      encrypt: true,
      dangerouslyIgnoreEtag: true,
      wasString: true,
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
    getFileWithMeta,
    getMetadataFile,
    getFileMetadata,
    saveMetadataFile,
    deleteFile,
    deleteAllFiles,
    metadata,
    refreshMetadata,
    isMetadataRefreshing,
  };
};
