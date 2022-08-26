import { useAuth } from "@/hooks/use-auth";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Collapse,
  Link,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { Menu, Upload, X } from "react-feather";
import NextLink from "next/link";
import { LogIn, LogOut } from "react-feather";
import Logo from "@/components/Logo";

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
              opacity: 0.8,
            }}
            mt={1}
          >
            <Logo height={48} width={48} />
          </Link>
        </NextLink>

        <DesktopNav />

        {userData ? (
          <Button onClick={logout} leftIcon={<Icon as={LogOut} />}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button
            onClick={authenticate}
            bg="blue.600"
            color="white"
            _hover={{ bg: "blue.500" }}
            leftIcon={<Icon as={LogIn} />}
          >
            Connect Wallet
          </Button>
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
    <Stack
      direction={"row"}
      spacing={4}
      display={{ base: "none", md: "flex" }}
      mr={-24}
    >
      {NAV_ITEMS.map(navItem => (
        <NextLink key={navItem.label} href={navItem.href ?? "#"} passHref>
          <Link
            as={Button}
            leftIcon={<Icon as={Upload} />}
            fontWeight="semibold"
            color="gray.100"
            _hover={{ textDecoration: "none" }}
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
