import useLoading from "@/hooks/use-loading";
import { useStorage } from "@/hooks/use-storage";
import { Flex, Heading, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MetadataFile } from "types/storage";

const Files = () => {
  const { getMetadataFile } = useStorage();
  const [metadata, setMetadata] = useState<MetadataFile | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetch = async () => {
      startLoading();
      const res = await getMetadataFile();
      setMetadata(res);
      stopLoading();
    };

    fetch();
  }, []);

  return (
    <>
      <Heading>Files</Heading>
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex>
          {metadata && Object.keys(metadata.files).length > 0 ? (
            Object.keys(metadata.files).map(path => {
              console.log(metadata.files[path as keyof MetadataFile["files"]]);
              return <div key={path}>{path}</div>;
            })
          ) : (
            <p>No files</p>
          )}
        </Flex>
      )}
    </>
  );
};

export default Files;
