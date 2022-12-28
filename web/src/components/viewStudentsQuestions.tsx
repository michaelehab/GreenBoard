import { Box, Flex, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { callEndpoint } from "../utils/callEndpoint";
import {
  GetCourseStudentsQuestionsRequest,
  GetCourseStudentsQuestionsResponse,
} from "@greenboard/shared";
import { StudentQuestionCard } from "./studentQuestionCard";
import { NotFound } from "../pages/notFound";

export const ViewStudentsQuestions = () => {
  const { courseId } = useParams();

  const { data: studentsQuestions } = useQuery(
    [`view${courseId}studentsQuestions`],
    () =>
      callEndpoint<
        GetCourseStudentsQuestionsRequest,
        GetCourseStudentsQuestionsResponse
      >(`/courses/${courseId}/questions`, "GET", true)
  );

  if (!courseId || !studentsQuestions) {
    return <NotFound />;
  }

  return (
    <Center>
      <Box>
        <Flex direction="column">
          {!!studentsQuestions?.questions &&
          studentsQuestions.questions.length > 0 ? (
            studentsQuestions?.questions.map((question, i) => (
              <StudentQuestionCard key={i} {...question} />
            ))
          ) : (
            <p>No Questions right now</p>
          )}
        </Flex>
      </Box>
    </Center>
  );
};
