import { extendTheme } from "@chakra-ui/react";

import Tabs from "./components/tabs";

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
    Tabs: Tabs,
  },
});

export { theme };
