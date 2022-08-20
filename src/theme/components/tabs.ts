import { PartsStyleFunction } from "@chakra-ui/react";

const variantCustomTabs: PartsStyleFunction = () => {
  return {
    tab: {
      borderRadius: "md",
      fontWeight: "semibold",
      color: "gray.300",
      _selected: {
        color: `white`,
        bg: `whiteAlpha.200`,
      },
      _hover: {
        bg: "whiteAlpha.100",
      },
    },
    tablist: {
      borderRadius: "md",
      backgroundColor: "whiteAlpha.200",
      py: 2,
      px: 2,
      experimental_spaceX: 2,
    },
  };
};

const extendedTheme = {
  variants: {
    custom: variantCustomTabs,
  },
};

export default extendedTheme;
