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
} from "@chakra-ui/react";
import { useState } from "react";

const Upload = () => {
  const [text, setText] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [isPublic, setPublic] = useState<boolean>(false);

  const { saveFile } = useStorage();

  const toast = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
  };

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublic(e.target.checked);
  };

  const handleUpload = async () => {
    let data;

    if (text) {
      data = text;
    }

    const url = await saveFile(filename, data, isPublic);

    toast({
      title: "File uploaded",
      description: url,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Tabs variant="unstyled">
        <TabList>
          <Tab>Text</Tab>
          <Tab>File</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <FormControl isRequired>
              <FormLabel>Text</FormLabel>
              <Textarea onChange={handleTextChange} />
            </FormControl>
          </TabPanel>
          <TabPanel>
            <p>TODO: File upload</p>
          </TabPanel>
        </TabPanels>

        <Flex experimental_spaceY={4} flexDir="column">
          <FormControl isRequired>
            <FormLabel>Filename</FormLabel>
            <Input onChange={handleFilenameChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Is Public?</FormLabel>
            <Switch
              id="isPublic"
              isChecked={isPublic}
              onChange={handlePublicChange}
            />
          </FormControl>

          <Button onClick={handleUpload}>Upload</Button>
        </Flex>
      </Tabs>
    </Box>
  );
};

export default Upload;
