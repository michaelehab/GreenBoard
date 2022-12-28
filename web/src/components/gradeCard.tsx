import { Text, Center, Box } from "@chakra-ui/react";
import { GradeWithName } from "@greenboard/shared";
import { isLoggedInInstructor } from "../utils/auth";

export const GradeCard: React.FC<GradeWithName> = (grade) => {
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
        <Text fontSize="md" fontWeight="bold">
          {grade.quizName} | {grade.grade}%
        </Text>
        {isLoggedInInstructor() && (
          <Text>
            {grade.studentFirstName} {grade.studentLastName}
          </Text>
        )}
        <Text>{new Date(grade.takenAt).toDateString()}</Text>
      </Box>
    </Center>
  );
};
