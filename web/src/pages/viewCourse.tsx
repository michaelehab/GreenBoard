import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Input,
  Center,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { isLoggedIn, isLoggedInUser } from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import {
  GetCourseDataRequest,
  GetCourseDataResponse,
} from "@greenboard/shared";
import { ApiError } from "../utils/apiError";

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
      </Box>
    </Center>
  );
};
