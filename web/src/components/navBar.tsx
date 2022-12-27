/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  useMediaQuery,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Logo from "../assets/logo/png/logo-no-background.png";
import boardOnly from "../assets/logo/png/board-only.png";
import AdminAvatar from "../assets/admin.jpg";
import userOutline from "../assets/userOutline.svg";
import {
  LOCAL_STORAGE_ROLE,
  isLoggedIn,
  isLoggedInAdmin,
  isLoggedInCollege,
  isLoggedInDepartment,
  isLoggedInSchool,
  isLoggedInUser,
  signOut,
} from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const NavBar = () => {
  const navigate = useNavigate();
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");

  const onSignOut = useCallback(() => {
    signOut();
    navigate("/");
  }, [navigate]);

  return (
    <>
      <Box bg="#4d7e3e" px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Link to={"/"}>
              {isLargerThan600 ? (
                <Image src={Logo} height={8} />
              ) : (
                <Image src={boardOnly} height={8} />
              )}
            </Link>
          </HStack>
          {isLoggedIn() ? (
            <Flex alignItems={"center"}>
              {isLoggedInAdmin() && (
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
              )}
              {isLoggedInCollege() && (
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
              {isLoggedInSchool() && (
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
              {isLoggedInDepartment() && (
                <>
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
                  <Link to={"/new/student"}>
                    <Button
                      variant={"solid"}
                      colorScheme="green"
                      size={"sm"}
                      mr={4}
                      leftIcon={<AddIcon />}
                    >
                      Add Student
                    </Button>
                  </Link>
                </>
              )}

              {isLoggedInUser() && isLargerThan600 && (
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
              )}

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  {isLoggedInAdmin() ? (
                    <Avatar size={"md"} src={AdminAvatar} />
                  ) : (
                    <Avatar size={"md"} src={userOutline} bg="white" />
                  )}
                </MenuButton>
                <MenuList>
                  {!isLargerThan600 && (
                    <>
                      <MenuItem>
                        <Link to={"/announcements"}>My Announcements</Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to={"/courses"}>My Courses</Link>
                      </MenuItem>
                    </>
                  )}
                  {localStorage.getItem(LOCAL_STORAGE_ROLE) ===
                    "INSTRUCTOR" && (
                    <MenuItem>
                      <Link to={"/new/course"}>Create Course</Link>
                    </MenuItem>
                  )}
                  {isLoggedInUser() && (
                    <MenuItem>
                      <Link to={"/courses/available"}>Join Course</Link>
                    </MenuItem>
                  )}
                  <Link to={`/`}>
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <MenuDivider />
                  <MenuItem onClick={onSignOut}>Sign Out</MenuItem>
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
      </Box>
    </>
  );
};
