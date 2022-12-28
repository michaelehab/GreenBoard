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
import {
  getLocalSchoolId,
  getLocalUserId,
  isLoggedInStudent,
} from "../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetStudentRequest, GetStudentResponse } from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
export const StudentProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { studentId } = useParams();

  const { data: studentData } = useQuery([`viewStudentProfile`], () =>
    callEndpoint<GetStudentRequest, GetStudentResponse>(
      `/students/${studentId}`,
      "GET",
      true
    )
  );
  useEffect(() => {
    if (!isLoggedInStudent()) {
      navigate("/");
    }
  }, [navigate, studentData]);

  if (!studentData) {
    return <NotFound />;
  }

  return (
    <Center>
      <Box>
        <Heading color="#4d7e3e">Student Profile</Heading>

        <Flex maxW="sm" mx="auto" my={12} direction="column" gap={3}>
          <Box m="auto">
            <Text fontSize="large">
              First Name: {studentData.student.firstName}
            </Text>
            <Text fontSize="large">
              Last Name: {studentData.student.lastName}
            </Text>
            <Text fontSize="large"> Email: {studentData.student.email}</Text>
            <Text fontSize="large">
              Phone: {studentData.student.phoneNumber}
            </Text>
            <Text fontSize="large">
              Department Name: {studentData.departmentName}
            </Text>
            <Text fontSize="large">School Name: {studentData.schoolName}</Text>
            <Text fontSize="large">
              College Name: {studentData.collegeName}
            </Text>
          </Box>
          {isLoggedInStudent() && getLocalUserId() === studentId && (
            <Flex gap={2}>
              <Link to={`/students/edit`}>
                <Button
                  colorScheme="green"
                  variant="solid"
                  type="submit"
                  display="block"
                >
                  Edit
                </Button>
              </Link>
              <Link to={`/change-password`}>
                <Button
                  colorScheme="green"
                  variant="solid"
                  type="submit"
                  display="block"
                >
                  Change Password
                </Button>
              </Link>
            </Flex>
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
