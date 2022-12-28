import { Box, Flex, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { callEndpoint } from "../utils/callEndpoint";
import { ListGradesRequest, ListGradesResponse } from "@greenboard/shared";
import { GradeCard } from "./gradeCard";
import { NotFound } from "../pages/notFound";

export const ViewStudentsGrades = () => {
  const { courseId, quizId } = useParams();

  const { data: quizGrades } = useQuery(
    [`view${courseId}Quiz${quizId}Grades`],
    () =>
      callEndpoint<ListGradesRequest, ListGradesResponse>(
        `/courses/${courseId}/quizzes/${quizId}/grades`,
        "GET",
        true
      )
  );

  if (!courseId || !quizGrades) {
    return <NotFound />;
  }

  return (
    <Center>
      <Box>
        <Flex direction="column">
          {!!quizGrades?.grades && quizGrades.grades.length > 0 ? (
            quizGrades?.grades.map((grade, i) => (
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
