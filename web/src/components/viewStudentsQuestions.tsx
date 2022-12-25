import { Box, Flex, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router";
import { isLoggedInUser } from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import {
  GetCourseStudentsQuestionsRequest,
  GetCourseStudentsQuestionsResponse,
} from "@greenboard/shared";
import { ApiError } from "../utils/apiError";
import { StudentQuestionCard } from "./studentQuestionCard";

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
    <p>Not Found</p>;
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
