import {
  Box,
  Button,
  Flex,
  Input,
  Alert,
  AlertIcon,
  Heading,
  Center,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError } from "../utils/apiError";
import { getLocalUserId, isLoggedInInstructor } from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
import {
  GetInstructorRequest,
  GetInstructorResponse,
} from "@greenboard/shared";
export const InstructorProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { instructorId } = useParams();

  const { data: instructorData } = useQuery([`viewInstructorProfile`], () =>
    callEndpoint<GetInstructorRequest, GetInstructorResponse>(
      `/instructor/${instructorId}`,
      "GET",
      true
    )
  );
  const edit = () => {
    navigate(`/instructors/edit`);
  };
  useEffect(() => {
    if (!isLoggedInInstructor()) {
      navigate("/");
    }
  }, [navigate, instructorData]);

  if (!instructorData) {
    return <NotFound />;
  }

  return (
    <Center>
      <Box>
        <Heading color="#4d7e3e">Instructor Profile</Heading>

        <Flex maxW="sm" mx="auto" my={12} direction="column" gap={3}>
          <Box m="auto">
            <Text fontSize="large">
              {" "}
              First Name: {instructorData.instructor.firstName}
            </Text>
            <Text fontSize="large">
              {" "}
              Last Name: {instructorData.instructor.lastName}
            </Text>
            <Text fontSize="large">
              {" "}
              Email: {instructorData.instructor.email}
            </Text>
            <Text fontSize="large">
              {" "}
              Phone: {instructorData.instructor.phoneNumber}
            </Text>
            <Text fontSize="large">
              {" "}
              Department Name: {instructorData.departmentName}
            </Text>
            <Text fontSize="large">
              School Name: {instructorData.schoolName}
            </Text>
            <Text fontSize="large">
              {" "}
              College Name: {instructorData.collegeName}
            </Text>
          </Box>
          {isLoggedInInstructor() && getLocalUserId() === instructorId && (
            <Box m="auto" my={12}>
              <Button
                colorScheme="green"
                variant="solid"
                type="submit"
                display="block"
                onClick={edit}
              >
                Edit
              </Button>
            </Box>
          )}

          {!!error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
        </Flex>
      </Box>
    </Center>
  );
};
