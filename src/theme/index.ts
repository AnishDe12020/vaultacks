import { extendTheme } from "@chakra-ui/react";

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
});

export { theme };
