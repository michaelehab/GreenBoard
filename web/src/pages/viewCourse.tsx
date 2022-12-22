import { Box, Flex, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router";
import { isLoggedInUser } from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import {
  GetCourseDataRequest,
  GetCourseDataResponse,
} from "@greenboard/shared";
import { ApiError } from "../utils/apiError";
import { ViewCoursePosts } from "../components/viewCoursePosts";
import { ViewStudentsQuestions } from "../components/viewStudentsQuestions";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

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
        } else {
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
    <Center>
      <Box>
        <Flex align="center">
          <h1>{courseData?.course.name}</h1>
          <h1>{courseData?.course.id}</h1>
          <h1>{courseData?.course.courseCode}</h1>
        </Flex>
        <Tabs align="center" colorScheme="green">
          <TabList>
            <Tab>Students Questions</Tab>
            <Tab>Course Posts</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ViewStudentsQuestions />
            </TabPanel>
            <TabPanel>
              <ViewCoursePosts />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
};
