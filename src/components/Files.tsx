import useLoading from "@/hooks/use-loading";
import { useStorage } from "@/hooks/use-storage";
import {
  Button,
  Flex,
  Heading,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IFile, MetadataFile } from "@/types/storage";
import { format } from "date-fns";
import { Share2, Trash2 } from "react-feather";

const Files = () => {
  const { getMetadataFile } = useStorage();
  const [metadata, setMetadata] = useState<MetadataFile | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetch = async () => {
      const res = await getMetadataFile();
      setMetadata(res);
      stopLoading();
    };

    startLoading();
    fetch();
  }, []);

  console.log(metadata?.files);

  return (
    <>
      <Heading>Files</Heading>
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex direction="column" experimental_spaceY={4}>
          {metadata && Object.keys(metadata.files).length > 0 ? (
            Object.keys(metadata.files).map(path => {
              const { isPublic, lastModified, url }: IFile = metadata.files[
                path as keyof MetadataFile["files"]
              ] as IFile;
              return (
                <Flex
                  key={path}
                  bg="whiteAlpha.200"
                  p={4}
                  rounded="md"
                  direction="column"
                  experimental_spaceY={4}
                >
                  <Text fontWeight="bold" fontSize="lg">
                    {path}
                  </Text>
                  <Tooltip label={format(new Date(lastModified), "PPPPpppp")}>
                    <Text width="fit-content">
                      Last modified: {format(new Date(lastModified), "PPP")}
                    </Text>
                  </Tooltip>

                  <Flex experimental_spaceX={4}>
                    <Button
                      leftIcon={<Trash2 />}
                      colorScheme="red"
                      bg="red.400"
                      size="sm"
                    >
                      Delete
                    </Button>
                    <Popover trigger="click">
                      <PopoverTrigger>
                        <Button
                          as={isPublic ? Link : Button}
                          href={isPublic && url}
                          isExternal={isPublic}
                          colorScheme="cyan"
                          backgroundColor="cyan.400"
                          leftIcon={<Share2 />}
                          size="sm"
                        >
                          Share
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Private File</PopoverHeader>
                        <PopoverBody>
                          <Text>
                            This is a private file. You can go to the URL but
                            you will be only able to see the encrypted content
                          </Text>
                          <Button
                            as={Link}
                            isExternal
                            size="sm"
                            href={url}
                            mt={2}
                          >
                            Go to private URL
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Flex>
                </Flex>
              );
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
