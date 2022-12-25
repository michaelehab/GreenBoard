import { Box, Flex, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { callEndpoint } from "../utils/callEndpoint";
import {
  GetCourseStudentsQuestionsRequest,
  GetCourseStudentsQuestionsResponse,
  ListGradesRequest,
  ListGradesResponse,
} from "@greenboard/shared";
import { StudentQuestionCard } from "./studentQuestionCard";
import { GradeCard } from "./gradeCard";

export const ViewGrades = () => {
  const { courseId } = useParams();

  const { data: studentGrades } = useQuery([`view${courseId}Grades`], () =>
    callEndpoint<ListGradesRequest, ListGradesResponse>(
      `/courses/${courseId}/grades`,
      "GET",
      true
    )
  );

  return (
    <Center>
      <Box>
        <Flex direction="column">
          {!!studentGrades?.grades && studentGrades.grades.length > 0 ? (
            studentGrades?.grades.map((grade, i) => (
              <GradeCard key={i} {...grade} />
            ))
          ) : (
            <p>No Grades right now</p>
          )}
        </Flex>
      </Box>
    </Center>
  );
};
