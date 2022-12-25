import { Box, Flex, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { callEndpoint } from "../utils/callEndpoint";
import {
  ListAvailableQuizzesRequest,
  ListAvailableQuizzesResponse,
} from "@greenboard/shared";
import { NotFound } from "../pages/notFound";
import { QuizCard } from "./quizCard";

export const ViewCourseQuizzes = () => {
  const { courseId } = useParams();

  const { data: courseQuizzes } = useQuery([`view${courseId}Quizzes`], () =>
    callEndpoint<ListAvailableQuizzesRequest, ListAvailableQuizzesResponse>(
      `/courses/${courseId}/quizzes`,
      "GET",
      true
    )
  );

  if (!courseId || !courseQuizzes) {
    return <NotFound />;
  }

  return (
    <Center>
      <Box>
        <Flex direction="column">
          {!!courseQuizzes?.quizzes && courseQuizzes.quizzes.length > 0 ? (
            courseQuizzes?.quizzes.map((quiz, i) => (
              <QuizCard key={i} {...quiz} />
            ))
          ) : (
            <p>No Quizzes right now</p>
          )}
        </Flex>
      </Box>
    </Center>
  );
};
