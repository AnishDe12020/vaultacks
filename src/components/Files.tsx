import { Heading, Spinner, Grid } from "@chakra-ui/react";
import { MutableRefObject, useEffect, useRef } from "react";
import File from "@/components/File";
import { IFile, MetadataFile } from "@/types/storage";
import { useStorage } from "@/hooks/use-storage";

const Files = () => {
  const { refreshMetadata, metadata, isMetadataRefreshing } = useStorage();

  useEffect(() => {
    const fetchFiles = async () => {
      await refreshMetadata();
    };

    fetchFiles();
  }, []);

  return (
    <>
      <Heading>Files</Heading>
      {isMetadataRefreshing ? (
        <Spinner />
      ) : (
        <Grid
          templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap={6}
          w="100%"
        >
          {metadata && Object.keys(metadata.files).length > 0 ? (
            Object.keys(metadata.files).map(path => {
              const { isPublic, lastModified, url }: IFile = metadata?.files[
                path as keyof MetadataFile["files"]
              ] as IFile;
              return (
                <File
                  key={path}
                  path={path}
                  isPublic={isPublic}
                  lastModified={lastModified}
                  url={url}
                />
              );
            })
          ) : (
            <p>No files</p>
          )}
        </Grid>
      )}
    </>
  );
};

export default Files;
