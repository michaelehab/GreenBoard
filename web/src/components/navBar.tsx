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
import UserAvatar from "../assets/user.jpg";
import AdminAvatar from "../assets/admin.jpg";
import {
  LOCAL_STORAGE_ROLE,
  isLoggedIn,
  isLoggedInUser,
  signOut,
} from "../utils/auth";
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
  const URLArray = window.location.pathname.split("/");

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
              {localStorage.getItem(LOCAL_STORAGE_ROLE) === "COLLEGE" ||
              localStorage.getItem(LOCAL_STORAGE_ROLE) === "SCHOOL" ||
              localStorage.getItem(LOCAL_STORAGE_ROLE) === "DEPARTMENT" ? (
                <Link to={"/new/announcement"}>
                  <Button
                    variant={"solid"}
                    colorScheme="green"
                    size={"sm"}
                    mr={4}
                    leftIcon={<AddIcon />}
                  >
                    Create Announcement
                  </Button>
                </Link>
              ) : (
                <></>
              )}
              {localStorage.getItem(LOCAL_STORAGE_ROLE) === "COLLEGE" && (
                <Link to={"/new/school"}>
                  <Button
                    variant={"solid"}
                    colorScheme="green"
                    size={"sm"}
                    mr={4}
                    leftIcon={<AddIcon />}
                  >
                    Create School
                  </Button>
                </Link>
              )}
              {localStorage.getItem(LOCAL_STORAGE_ROLE) === "SCHOOL" && (
                <Link to={"/new/department"}>
                  <Button
                    variant={"solid"}
                    colorScheme="green"
                    size={"sm"}
                    mr={4}
                    leftIcon={<AddIcon />}
                  >
                    Create Department
                  </Button>
                </Link>
              )}
              {localStorage.getItem(LOCAL_STORAGE_ROLE) === "DEPARTMENT" && (
                <Link to={"/new/instructor"}>
                  <Button
                    variant={"solid"}
                    colorScheme="green"
                    size={"sm"}
                    mr={4}
                    leftIcon={<AddIcon />}
                  >
                    Add Instructor
                  </Button>
                </Link>
              )}
              {localStorage.getItem(LOCAL_STORAGE_ROLE) === "INSTRUCTOR" &&
              URLArray.length > 2 &&
              URLArray[1] === "courses" ? (
                <Link to={`/courses/${URLArray[2]}/new/post`}>
                  <Button
                    variant={"solid"}
                    colorScheme="green"
                    size={"sm"}
                    mr={4}
                    leftIcon={<AddIcon />}
                  >
                    Post
                  </Button>
                </Link>
              ) : (
                <></>
              )}
              {localStorage.getItem(LOCAL_STORAGE_ROLE) === "STUDENT" &&
              URLArray.length > 2 &&
              URLArray[1] === "courses" ? (
                <Link to={`/courses/${URLArray[2]}/new/question`}>
                  <Button
                    variant={"solid"}
                    colorScheme="green"
                    size={"sm"}
                    mr={4}
                    leftIcon={<AddIcon />}
                  >
                    Ask
                  </Button>
                </Link>
              ) : (
                <></>
              )}
              {localStorage.getItem(LOCAL_STORAGE_ROLE) === "INSTRUCTOR" ||
              localStorage.getItem(LOCAL_STORAGE_ROLE) === "STUDENT" ? (
                <Flex>
                  <Link to={"/announcements"}>
                    <Button
                      variant={"solid"}
                      colorScheme="green"
                      size={"sm"}
                      mr={4}
                    >
                      My Announcements
                    </Button>
                  </Link>
                  <Link to={"/courses"}>
                    <Button
                      variant={"solid"}
                      colorScheme="green"
                      size={"sm"}
                      mr={4}
                    >
                      My Courses
                    </Button>
                  </Link>
                </Flex>
              ) : (
                <></>
              )}

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  {localStorage.getItem(LOCAL_STORAGE_ROLE) === "COLLEGE" ||
                  localStorage.getItem(LOCAL_STORAGE_ROLE) === "SCHOOL" ||
                  localStorage.getItem(LOCAL_STORAGE_ROLE) === "DEPARTMENT" ? (
                    <Avatar size={"md"} src={AdminAvatar} />
                  ) : (
                    <Avatar size={"md"} src={UserAvatar} />
                  )}
                </MenuButton>
                <MenuList>
                  {localStorage.getItem(LOCAL_STORAGE_ROLE) ===
                    "INSTRUCTOR" && (
                    <MenuItem>
                      <Link to={"/new/course"}>Create Course</Link>
                      <MenuDivider />
                    </MenuItem>
                  )}
                  {isLoggedInUser() && (
                    <MenuItem>
                      <Link to={"/courses/available"}>Join Course</Link>
                      <MenuDivider />
                    </MenuItem>
                  )}
                  <Link to={`/`}>
                    <MenuItem>Profile</MenuItem>
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
