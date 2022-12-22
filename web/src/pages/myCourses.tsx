import { useQuery } from "@tanstack/react-query";

import { callEndpoint } from "../utils/callEndpoint";
import { useTitle } from "../utils/useTitle";
import { Center, Text, Flex } from "@chakra-ui/react";
import {
  ListEnrolledInCoursesRequest,
  ListEnrolledInCoursesResponse,
} from "@greenboard/shared";
import { CourseCard } from "../components/courseCard";

export const ListCourses = () => {
  useTitle("Courses");
  const { data, error, isLoading } = useQuery(["listCourses"], () =>
    callEndpoint<ListEnrolledInCoursesRequest, ListEnrolledInCoursesResponse>(
      "/courses/",
      "GET",
      true
    )
  );

  if (isLoading) {
    return <div>Is Loading...</div>;
  }
  if (error) {
    return <div>Error loading Courses!</div>;
  }

  return (
    <Center>
      <Flex direction="column">
        {!!data?.courses && data.courses.length > 0 ? (
          data?.courses.map((course, i) => <CourseCard key={i} {...course} />)
        ) : (
          <Text>No Posts right now</Text>
        )}
      </Flex>
    </Center>
  );
};
