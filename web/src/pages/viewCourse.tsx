import { Box, Flex, Center, Heading, Text, Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router";
import {
  isLoggedInInstructor,
  isLoggedInStudent,
  isLoggedInUser,
} from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import {
  GetCourseDataRequest,
  GetCourseDataResponse,
} from "@greenboard/shared";
import { ApiError } from "../utils/apiError";
import { ViewCoursePosts } from "../components/viewCoursePosts";
import { ViewStudentsQuestions } from "../components/viewStudentsQuestions";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { ViewCourseQuizzes } from "../components/viewAvailableQuizzes";
import { AddIcon } from "@chakra-ui/icons";

export const ViewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: courseData } = useQuery([`view${courseId}Course`], () =>
    callEndpoint<GetCourseDataRequest, GetCourseDataResponse>(
      `/courses/${courseId}`,
      "GET",
      true
    ).catch((err) => {
      if (err instanceof ApiError && err.status === 403) {
        if (err.status === 403) {
          navigate(`/join/${courseId}`);
        } else if (err.status === 404) {
          navigate(`/`);
        }
      }
    })
  );

  useEffect(() => {
    if (!isLoggedInUser()) {
      navigate("/");
    }
  }, [navigate]);

  if (!courseId || !courseData) {
    <p>Not Found</p>;
  }

  return (
    <Center flexDirection="column">
      <Flex
        boxShadow="md"
        p="6"
        rounded="md"
        width="100%"
        justifyContent="space-between"
      >
        <Heading as="h2" size="xl">
          {courseData?.course.courseCode} | {courseData?.course.name}
        </Heading>
        {isLoggedInInstructor() && (
          <Box flexDirection="column">
            <Link to={`/courses/${courseId}/new/post`}>
              <Button
                variant={"solid"}
                colorScheme="green"
                size={"sm"}
                mr={4}
                leftIcon={<AddIcon />}
              >
                Post
              </Button>
            </Link>
            <Link to={`/courses/${courseId}/new/quiz`}>
              <Button
                variant={"solid"}
                colorScheme="green"
                size={"sm"}
                mr={4}
                leftIcon={<AddIcon />}
              >
                Quiz
              </Button>
            </Link>
          </Box>
        )}
        {isLoggedInStudent() && (
          <Link to={`/courses/${courseId}/new/question`}>
            <Button
              variant={"solid"}
              colorScheme="green"
              size={"sm"}
              mr={4}
              leftIcon={<AddIcon />}
            >
              Ask
            </Button>
          </Link>
        )}
      </Flex>
      <Tabs align="center" colorScheme="green">
        <TabList>
          <Tab>Course Posts</Tab>
          <Tab>Students Questions</Tab>
          <Tab>Quizzes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ViewCoursePosts />
          </TabPanel>
          <TabPanel>
            <ViewStudentsQuestions />
          </TabPanel>
          <TabPanel>
            <ViewCourseQuizzes />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Center>
  );
};
