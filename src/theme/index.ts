import { extendTheme } from "@chakra-ui/react";

import Tabs from "./components/tabs";
import Tooltip from "./components/tooltip";
import Popover from "./components/popover";
import Modal from "./components/modal";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        background: "black",
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  components: {
    Tabs,
    Tooltip,
    Popover,
    Modal,
  },
});

export { theme };
