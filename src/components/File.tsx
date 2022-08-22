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
  Grid,
} from "@chakra-ui/react";
import { MutableRefObject, useEffect, useRef } from "react";
import { IFile, MetadataFile } from "@/types/storage";
import { format } from "date-fns";
import { Share2, Trash2 } from "react-feather";
import useLoading from "@/hooks/use-loading";
import { useStorage } from "@/hooks/use-storage";

interface IFileProps {
  path: string;
  isPublic: boolean;
  lastModified: string;
  url: string;
}

const File = ({ path, isPublic, lastModified, url }: IFileProps) => {
  const { deleteFile } = useStorage();

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
    stopDeleteLoading();
    onDeleteAlertDialogClose();
  };

  return (
    <Flex
      bg="whiteAlpha.200"
      p={4}
      rounded="md"
      direction="column"
      experimental_spaceY={4}
    >
      <Text fontWeight="bold" fontSize="lg">
        {path}
      </Text>
      <Box>
        <Tooltip label={format(new Date(lastModified), "PPPPpppp")}>
          <Text width="fit-content">
            Last modified: {format(new Date(lastModified), "PPP")}
          </Text>
        </Tooltip>
      </Box>

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
                  Are you sure you want to delete this file? This operation
                  cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                  <Button
                    onClick={onDeleteAlertDialogClose}
                    ref={deleteDialogCancelRef}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    bg="red.400"
                    onClick={async () => await handleDeleteFile(path)}
                    isLoading={isDeleteLoading}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
        {isPublic ? (
          <Button
            as={Link}
            href={url}
            isExternal
            colorScheme="cyan"
            backgroundColor="cyan.400"
            leftIcon={<Share2 />}
            size="sm"
          >
            Share
          </Button>
        ) : (
          <Popover trigger="click">
            <PopoverTrigger>
              <Button
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
                  This is a private file. You can go to the URL but you will be
                  only able to see the encrypted content
                </Text>
                <Button as={Link} isExternal size="sm" href={url} mt={2}>
                  Go to private URL
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Flex>
    </Flex>
  );
};

export default File;
