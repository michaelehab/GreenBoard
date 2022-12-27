import {
  Text,
  Center,
  Box,
  Link as ChakraLink,
  Avatar,
  WrapItem,
  Stack,
  Flex,
  Container,
} from "@chakra-ui/react";
import { Post, UserDataAndPost } from "@greenboard/shared";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

export const StudentQuestionCard: React.FC<UserDataAndPost> = (question) => {
  return (
    <Center>
      <Flex
        maxW={"3xl"}
        w={["sm", "xl", "3xl"]}
        h={120}
        m={5}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
        justifyContent="space-between"
        flexDirection="column"
      >
        <Flex gap={2}>
          <Link to={`/courses/${question.courseId}/questions/${question.id}`}>
            <Text fontSize="md" fontWeight="bold">
              {question.title}
            </Text>
          </Link>
          {question.url !== "NoLink" && (
            <ChakraLink color="#4d7e3e" href={question.url}>
              Visit Link
            </ChakraLink>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Stack direction="row">
            <WrapItem>
              <Avatar
                size={"xs"}
                name={`${question.firstName} ${question.lastName}`}
              />
            </WrapItem>
            <Text fontSize="md">
              {question.firstName} {question.lastName}
            </Text>
          </Stack>
          <Text color="#4d7e3e">{format(question.postedAt, "en_US")}</Text>
        </Flex>
      </Flex>
    </Center>
  );
};
