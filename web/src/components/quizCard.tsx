import { Text, Center, Box, Link as ChakraLink } from "@chakra-ui/react";
import { QuizWithName } from "@greenboard/shared";
import { Link } from "react-router-dom";

export const QuizCard: React.FC<QuizWithName> = (quiz) => {
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
        <Link to={`/courses/${quiz.courseId}/quizzes/${quiz.id}`}>
          <Text fontSize="md" fontWeight="bold">
            {quiz.quizName}
          </Text>
          <Text>{new Date(quiz.quizDate).toDateString()}</Text>
        </Link>
      </Box>
    </Center>
  );
};
