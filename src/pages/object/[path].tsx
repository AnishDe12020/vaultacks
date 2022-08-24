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

const ObjectPage: NextPage = () => {
  const {
    query: { path },
  } = useRouter();
  const { getFile, refreshMetadata } = useStorage();

  const [file, setFile] = useState<any>();
  const { onCopy: onTextCopy, hasCopied: hasCopiedText } = useClipboard(
    file?.data
  );

  console.log(file);

  const handleFileDownload = async () => {
    const blob = new Blob([file?.data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.meta.path;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchFile = async () => {
      await refreshMetadata();
      if (path) {
        const file = await getFile((path as string).trim());
        console.log("f", file);
        setFile(file);
      }
    };

    fetchFile();
  }, [path]);

  return (
    <>
      {file ? (
        <Box>
          <VStack spacing={4}>
            <Box>
              {file.meta.isString ? (
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
              {file.meta.path}
            </Heading>
            {file.meta.isString ? (
              <VStack>
                <Text bg="brand.primary" p={4} rounded="md">
                  {file.data}
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
              <Button
                leftIcon={<Icon as={Download} />}
                onClick={handleFileDownload}
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
