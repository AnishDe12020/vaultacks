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
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { FilePlus } from "react-feather";

const Upload = () => {
  const [data, setData] = useState<string>("");
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

  const { saveFile, refreshMetadata } = useStorage();

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
      toast({
        status: "error",
        title: "File Drop Rejected",
        description:
          fileRejections.length > 1
            ? "You can only select 1 file"
            : "Unknown error",
      });
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDropRejected,
    onDropAccepted,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
  };

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublic(e.target.checked);
  };

  const handleUpload = async () => {
    startUploadLoading();
    const url = await saveFile(filename, data, isPublic);

    toast({
      title: "File uploaded",
      description: url,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    stopUploadLoading();
  };

  return (
    <Box>
      <Tabs variant="custom">
        <TabList>
          <Tab>Text</Tab>
          <Tab>File</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <FormControl height="300px" width="400px" isRequired>
              <FormLabel>Text</FormLabel>
              <Textarea
                onChange={handleTextChange}
                height="90%"
                placeholder={
                  data &&
                  "A file has already been uploaded. Adding text there will replace the existing data"
                }
              />
            </FormControl>
          </TabPanel>
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
              width="400px"
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
                    Drag and drop the file here, or click to select files
                  </Text>
                  <Text>Uploading only 1 file is supported for now</Text>
                  {data && (
                    <Text>
                      A file has already been uploaded or there is text in the
                      text field. Uploading a file will replace the existing
                      data
                    </Text>
                  )}
                </>
              )}
            </Flex>
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
          <Switch
            id="isPublic"
            isChecked={isPublic}
            onChange={handlePublicChange}
          />
        </FormControl>

        <Button onClick={handleUpload} isLoading={isUploadLoading}>
          Upload
        </Button>
      </Flex>
    </Box>
  );
};

export default Upload;
