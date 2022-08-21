import { useAuth } from "@/hooks/use-auth";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Link,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { Menu, X } from "react-feather";

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();

  const { authenticate, logout, userData } = useAuth();

  return (
    <Box>
      <Flex
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        border="1px solid #2d2d2e"
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? (
                <Icon as={X} w={3} h={3} />
              ) : (
                <Icon as={Menu} w={4} h={4} />
              )
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} alignContent="center">
          <Text
            fontFamily={"heading"}
            color="white"
            fontSize="2xl"
            fontWeight="bold"
            mt={1}
          >
            Vaultacks
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {userData ? (
            <Button onClick={logout}>Sign Out</Button>
          ) : (
            <Button onClick={authenticate}>Sign In</Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map(navItem => (
        <Link
          key={navItem.label}
          p={2}
          href={navItem.href ?? "#"}
          fontSize={"lg"}
          fontWeight={500}
          color="gray.200"
          _hover={{
            textDecoration: "none",
            color: "gray.300",
          }}
        >
          {navItem.label}
        </Link>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack p={4} display={{ md: "none" }} borderBottom="1px solid #2d2d2e">
      {NAV_ITEMS.map(navItem => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight="semibold" color="gray.100">
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Upload",
    href: "/upload",
  },
];
