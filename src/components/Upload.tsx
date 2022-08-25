import useLoading from "@/hooks/use-loading";
import { useStorage } from "@/hooks/use-storage";
import {
  Box,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  Switch,
  useToast,
  Flex,
  Text,
  Spinner,
  Link,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { FilePlus } from "react-feather";

const MAX_FILE_SIZE = 15728640; // 20971520 is the max file size set by the default blockstack gaia hub. However, encryption increases the file size to almost 20MB (for a 15MB file).

type DATA_TYPE = "text" | "file";

const Upload = () => {
  const [data, setData] = useState<string>("");
  const [dataType, setDatatype] = useState<DATA_TYPE>();

  const [filename, setFilename] = useState<string>("");
  const [isPublic, setPublic] = useState<boolean>(false);
  const {
    isLoading: isFileReadLoading,
    startLoading: startFileReadLoading,
    stopLoading: stopFileReadLoading,
  } = useLoading();
  const {
    isLoading: isUploadLoading,
    startLoading: startUploadLoading,
    stopLoading: stopUploadLoading,
  } = useLoading();

  const { saveFile } = useStorage();

  const toast = useToast();

  const onDropAccepted = useCallback(
    (files: File[]) => {
      startFileReadLoading();
      const file = files[0];
      const reader = new FileReader();
      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "There was an error reading the selected file",
          status: "error",
        });
        stopFileReadLoading();
      };

      reader.onload = () => {
        setData(reader.result as string);
        setDatatype("file");
        setFilename(file.name);
        toast({
          title: "Read file",
          description: "File read successfully",
          status: "success",
        });
        stopFileReadLoading();
      };

      reader.readAsArrayBuffer(file);
    },
    [toast, startFileReadLoading, stopFileReadLoading]
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const errorMessage =
        fileRejections.length > 1
          ? "You can only select 1 file"
          : fileRejections[0].file.size > MAX_FILE_SIZE
          ? "File is too big"
          : "Unknown error";

      toast({
        status: "error",
        title: "File Drop Rejected",
        description: errorMessage,
      });
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDropRejected,
    onDropAccepted,
    maxSize: MAX_FILE_SIZE,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
    setDatatype("text");
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
  };

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublic(e.target.checked);
  };

  const handleUpload = async () => {
    startUploadLoading();

    try {
      const url = await saveFile(filename, data, isPublic, dataType === "text");

      toast({
        title: "File uploaded",
        description: (
          <Link href={url} isExternal color="cyan.900" fontWeight="bold">
            {url}
          </Link>
        ),
        status: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        description:
          "Something went wrong when uploading the file. This could be issues with file sizes, encryption, network, or anything else related to uploading the file.",
        status: "error",
      });
    }

    stopUploadLoading();
  };

  return (
    <Box>
      <Tabs variant="custom">
        <TabList>
          <Tab>File</Tab>
          <Tab>Text</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex
              direction="column"
              experimental_spaceY={4}
              justifyContent="center"
              alignItems="center"
              border="2px"
              borderStyle="dashed"
              borderColor="whiteAlpha.600"
              p={4}
              rounded="lg"
              cursor="pointer"
              _hover={{ borderColor: "whiteAlpha.500" }}
              height="300px"
              width={{ base: "300px", md: "400px", lg: "500px" }}
              textAlign="center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              <FilePlus />

              {isFileReadLoading ? (
                <Spinner />
              ) : isDragActive ? (
                <Text>Drop here</Text>
              ) : (
                <>
                  <Text>
                    Drag and drop the file here, or click to select a file
                  </Text>
                  <Text>Max file size: 15MB</Text>
                  <Text>Uploading only 1 file is supported for now</Text>

                  {data && dataType === "file" ? (
                    <Text>
                      A file has already been uploaded. Uploading a file will
                      replace the existing file
                    </Text>
                  ) : (
                    <Text>
                      There is some text in the text tab. Uploading a file will
                      replaced the text
                    </Text>
                  )}
                </>
              )}
            </Flex>
          </TabPanel>
          <TabPanel>
            <FormControl
              height="300px"
              width={{ base: "300px", md: "400px", lg: "500px" }}
              isRequired
            >
              <FormLabel>Text</FormLabel>
              <Textarea
                onChange={handleTextChange}
                height="90%"
                placeholder={
                  data &&
                  "A file has already been uploaded. Adding text here will replace the existing file"
                }
              />
            </FormControl>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex experimental_spaceY={4} flexDir="column">
        <FormControl isRequired>
          <FormLabel>Filename</FormLabel>
          <Input onChange={handleFilenameChange} value={filename} />
        </FormControl>

        <FormControl>
          <FormLabel>Is Public?</FormLabel>
          <Text fontSize="sm" color="gray.300">
            If the file is public, it wont be encrypted. Private files are
            encrypted and only you can decrypt it.
          </Text>
          <Switch
            id="isPublic"
            isChecked={isPublic}
            onChange={handlePublicChange}
            mt={4}
          />
        </FormControl>

        <Button
          onClick={handleUpload}
          isLoading={isUploadLoading}
          disabled={!filename || !data}
        >
          Upload
        </Button>
      </Flex>
    </Box>
  );
};

export default Upload;
