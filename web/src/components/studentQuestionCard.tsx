import { Text, Center, Box, Link as ChakraLink } from "@chakra-ui/react";
import { Post } from "@greenboard/shared";
import { Link } from "react-router-dom";

export const StudentQuestionCard: React.FC<Post> = (question) => {
  return (
    <Center>
      <Box
        maxW="6xl"
        w={["sm", "xl", "3xl"]}
        m={5}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
      >
        <Link to={`/courses/${question.courseId}/questions/${question.id}`}>
          <Text fontSize="md" fontWeight="bold">
            {question.title}
          </Text>
        </Link>
        <ChakraLink href={question.url}>Link</ChakraLink>
      </Box>
    </Center>
  );
};
