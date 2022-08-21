import useLoading from "@/hooks/use-loading";
import { useStorage } from "@/hooks/use-storage";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogBody,
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
  useDisclosure,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogContent,
  Box,
} from "@chakra-ui/react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { IFile, MetadataFile } from "@/types/storage";
import { format } from "date-fns";
import { Share2, Trash2 } from "react-feather";

const Files = () => {
  const { getMetadataFile, deleteFile } = useStorage();
  const [metadata, setMetadata] = useState<MetadataFile | null>(null);
  const {
    isLoading: isFilesLoading,
    startLoading: startFilesLoading,
    stopLoading: stopFilesLoading,
  } = useLoading();
  const {
    isLoading: isDeleteLoading,
    startLoading: startDeleteLoading,
    stopLoading: stopDeleteLoading,
  } = useLoading();

  const {
    isOpen: isDeleteAlertDialogOpen,
    onOpen: onDeleteAlertDialogOpen,
    onClose: onDeleteAlertDialogClose,
  } = useDisclosure();

  const deleteDialogCancelRef =
    useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>;

  const handleDeleteFile = async (path: string) => {
    startDeleteLoading();
    await deleteFile(path);
    await fetchFiles();
    stopDeleteLoading();
    onDeleteAlertDialogClose();
  };

  const fetchFiles = async () => {
    startFilesLoading();
    const res = await getMetadataFile();
    setMetadata(res);
    stopFilesLoading();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      <Heading>Files</Heading>
      {isFilesLoading ? (
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
                    <Box>
                      <Button
                        leftIcon={<Trash2 />}
                        colorScheme="red"
                        bg="red.400"
                        size="sm"
                        onClick={onDeleteAlertDialogOpen}
                      >
                        Delete
                      </Button>
                      <AlertDialog
                        isOpen={isDeleteAlertDialogOpen}
                        onClose={onDeleteAlertDialogClose}
                        leastDestructiveRef={deleteDialogCancelRef}
                      >
                        <AlertDialogOverlay>
                          <AlertDialogContent>
                            <AlertDialogHeader>Delete File</AlertDialogHeader>
                            <AlertDialogBody>
                              Are you sure you want to delete this file? This
                              operation cannot be undone.
                            </AlertDialogBody>
                            <AlertDialogFooter
                              as={Flex}
                              experimental_spaceX={4}
                            >
                              <Button
                                onClick={onDeleteAlertDialogClose}
                                ref={deleteDialogCancelRef}
                              >
                                Cancel
                              </Button>
                              <Button
                                colorScheme="red"
                                bg="red.400"
                                onClick={async () =>
                                  await handleDeleteFile(path)
                                }
                                isLoading={isDeleteLoading}
                              >
                                Delete
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialogOverlay>
                      </AlertDialog>
                    </Box>
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
