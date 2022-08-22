import {
  Spinner,
  Grid,
  Button,
  Spacer,
  Center,
  Text,
  Code,
  Link,
  Flex,
} from "@chakra-ui/react";
import { useEffect } from "react";
import File from "@/components/File";
import { IFile, MetadataFile } from "@/types/storage";
import { useStorage } from "@/hooks/use-storage";
import { RefreshCcw } from "react-feather";
import NextLink from "next/link";

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
      {metadata ? (
        <Button
          onClick={async () => await refreshMetadata()}
          leftIcon={<RefreshCcw />}
          mb={8}
          isLoading={isMetadataRefreshing}
        >
          Refresh
        </Button>
      ) : (
        <Spacer mb={8} h={4} />
      )}

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
            <Center as={Flex} flexDirection="column" experimental_spaceX={4}>
              <Text fontSize="xl" fontWeight="semibold">
                No files found
              </Text>
              <Text>
                Upload a file by heading over to{" "}
                <NextLink href="/upload" passHref>
                  <Code as={Link}>/upload</Code>
                </NextLink>
              </Text>
            </Center>
          )}
        </Grid>
      )}
    </>
  );
};

export default Files;
