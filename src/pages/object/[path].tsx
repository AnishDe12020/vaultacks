import { useStorage } from "@/hooks/use-storage";
import {
  Box,
  Heading,
  Spinner,
  VStack,
  Tooltip,
  Icon,
  Text,
  IconButton,
  useClipboard,
  Button,
} from "@chakra-ui/react";
import { Type, FileText, Copy, Check, Download } from "react-feather";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/use-loading";
import { IFile } from "@/types/storage";

const ObjectPage: NextPage = () => {
  const {
    query: { path },
  } = useRouter();
  const { getFile, getFileMetadata } = useStorage();

  const [metadata, setMetadata] = useState<IFile>();
  const [text, setText] = useState<string>("");
  const { onCopy: onTextCopy, hasCopied: hasCopiedText } = useClipboard(text);
  const {
    isLoading: isDownloading,
    startLoading: startDownloadLoading,
    stopLoading: stopDownloadLoading,
  } = useLoading();

  const handleFileDownload = async () => {
    startDownloadLoading();
    if (metadata) {
      const data = await getFile(metadata.path, !metadata.isPublic);

      const blob = new Blob([data as ArrayBuffer], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = metadata.path;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    stopDownloadLoading();
  };

  useEffect(() => {
    const fetchFile = async () => {
      if (path) {
        const pathParsed = (path as string).trim();
        const metadata = await getFileMetadata(pathParsed);

        setMetadata(metadata);

        if (metadata.isString) {
          const data = await getFile(pathParsed, !metadata.isPublic);
          setText(data as string);
        }
      }
    };

    fetchFile();
  }, [path]);

  return (
    <>
      {metadata ? (
        <Box>
          <VStack spacing={4}>
            <Box>
              {metadata.isString ? (
                <Tooltip label="Text">
                  <Icon as={Type} aria-label="Text" h={8} w={8} />
                </Tooltip>
              ) : (
                <Tooltip label="File">
                  <Icon as={FileText} aria-label="File" h={8} w={8} />
                </Tooltip>
              )}
            </Box>
            <Heading as="h2" fontSize="2xl">
              {metadata.path}
            </Heading>
            {metadata.isString ? (
              text ? (
                <VStack>
                  <Text bg="brand.primary" p={4} rounded="md">
                    {text}
                  </Text>
                  <IconButton
                    icon={
                      hasCopiedText ? <Icon as={Check} /> : <Icon as={Copy} />
                    }
                    aria-label="Copy Text"
                    onClick={onTextCopy}
                    colorScheme={hasCopiedText ? "green" : "gray"}
                  />
                </VStack>
              ) : (
                <Spinner />
              )
            ) : (
              <Button
                leftIcon={<Icon as={Download} />}
                onClick={handleFileDownload}
                isLoading={isDownloading}
              >
                Download
              </Button>
            )}
          </VStack>
        </Box>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default ObjectPage;
