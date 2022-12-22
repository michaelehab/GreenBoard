/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import Logo from "../assets/logo/png/logo-no-background.png";
import UserAvatar from "../assets/user.png";
import { isLoggedIn, signOut } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";

const Links: any[] = [];

const NavLink = (link: string) => {
  return (
    <Link to={link.toLowerCase()}>
      <Button
        px={2}
        py={1}
        color={"green"}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        {link}
      </Button>
    </Link>
  );
};

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const onSignout = useCallback(() => {
    signOut();
    navigate("/");
  }, [navigate]);

  return (
    <>
      <Box bg="#4d7e3e" px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {Links.length > 0 ? (
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
          ) : (
            <></>
          )}
          <HStack spacing={8} alignItems={"center"}>
            <Link to={"/"}>
              <Image src={Logo} height={8} />
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => NavLink(link))}
            </HStack>
          </HStack>
          {isLoggedIn() ? (
            <Flex alignItems={"center"}>
              <Link to={"/new/post"}>
                <Button
                  variant={"solid"}
                  colorScheme="green"
                  size={"sm"}
                  mr={4}
                  leftIcon={<AddIcon />}
                >
                  New Post
                </Button>
              </Link>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} src={UserAvatar} />
                </MenuButton>
                <MenuList>
                  <Link to={`/`}>
                    <MenuItem>My Profile</MenuItem>
                  </Link>
                  <MenuDivider />
                  <MenuItem onClick={onSignout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ) : (
            <Flex>
              <Link to={"/signin"}>
                <Button variant="solid" color="green" m={1}>
                  Sign In
                </Button>
              </Link>
              <Link to={"/signup"}>
                <Button colorScheme="green" variant="solid" m={1}>
                  Sign Up
                </Button>
              </Link>
            </Flex>
          )}
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => NavLink(link))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
