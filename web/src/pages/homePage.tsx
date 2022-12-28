/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTitle } from "../utils/useTitle";
import { Link } from "react-router-dom";

export const Home = () => {
  useTitle("Home");
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: useBreakpointValue({ base: "20%", md: "30%" }),
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "#4d7e3e",
                zIndex: -1,
              }}
            >
              GreenBoard
            </Text>
            <br />{" "}
            <Text color={"#4d7e3e"} as={"span"}>
              Better Education
            </Text>{" "}
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            GreenBoard helps you teach your students, learn from your courses,
            manage your college
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Link to={"/signup"}>
              <Button
                rounded={"full"}
                bg={"#4d7e3e"}
                color={"white"}
                _hover={{
                  bg: "green.500",
                }}
              >
                Join Now
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
          }
        />
      </Flex>
    </Stack>
  );
};
