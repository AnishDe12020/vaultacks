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
import NextLink from "next/link";

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

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();

  const { authenticate, logout, userData } = useAuth();

  return (
    <Box>
      <Flex
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={"center"}
        borderBottom="1px"
        borderColor="brand.secondary"
        justifyContent={"space-between"}
      >
        <IconButton
          onClick={onToggle}
          icon={
            isOpen ? (
              <Icon as={X} w={5} h={5} />
            ) : (
              <Icon as={Menu} w={5} h={5} />
            )
          }
          variant={"ghost"}
          aria-label={"Toggle Navigation"}
          display={{ md: "none" }}
        />
        <NextLink href="/" passHref>
          <Link
            fontFamily={"heading"}
            color="white"
            fontSize="2xl"
            fontWeight="bold"
            _hover={{
              color: "gray.300",
            }}
            mt={1}
          >
            Vaultacks
          </Link>
        </NextLink>

        <DesktopNav />

        {userData ? (
          <Button onClick={logout}>Sign Out</Button>
        ) : (
          <Button onClick={authenticate}>Sign In</Button>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  return (
    <Stack direction={"row"} spacing={4} display={{ base: "none", md: "flex" }}>
      {NAV_ITEMS.map(navItem => (
        <NextLink key={navItem.label} href={navItem.href ?? "#"} passHref>
          <Link
            p={2}
            fontSize={"lg"}
            fontWeight="semibold"
            color="gray.100"
            _hover={{
              color: "gray.300",
            }}
          >
            {navItem.label}
          </Link>
        </NextLink>
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
    <NextLink href={href ?? "#"} passHref>
      <Link
        py={2}
        href={href ?? "#"}
        fontWeight="semibold"
        color="gray.100"
        _hover={{
          color: "gray.300",
        }}
      >
        {label}
      </Link>
    </NextLink>
  );
};

export default Header;
