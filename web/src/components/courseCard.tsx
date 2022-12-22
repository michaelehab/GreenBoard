import { Text, Center, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CourseData } from "@greenboard/shared";

export const CourseCard: React.FC<CourseData> = (course) => {
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
        <Link to={`/courses/${course.id}`}>
          <Text fontSize="md" fontWeight="bold">
            {course.courseCode} | {course.name}
          </Text>
        </Link>
      </Box>
    </Center>
  );
};
