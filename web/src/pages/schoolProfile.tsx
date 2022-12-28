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
  getLocalCollegeId,
  getLocalSchoolId,
  isLoggedInCollege,
  isLoggedInInstructor,
  isLoggedInSchool,
} from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetSchoolRequest, GetSchoolResponse } from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
export const SchoolProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { schoolId } = useParams();

  const { data: schoolData } = useQuery([`viewSchoolProfile`], () =>
    callEndpoint<GetSchoolRequest, GetSchoolResponse>(
      `/school/${schoolId}`,
      "GET",
      true
    )
  );
  const edit = () => {
    navigate(`/school/edit`);
  };
  useEffect(() => {
    if (!isLoggedInSchool()) {
      navigate("/");
    }
  }, [navigate, schoolData]);

  if (!schoolData) {
    return <NotFound />;
  }

  return (
    <Center>
      <Box>
        <Heading color="#4d7e3e">School Profile</Heading>

        <Flex maxW="sm" mx="auto" my={12} direction="column" gap={3}>
          <Box m="auto">
            <Text fontSize="large"> Name: {schoolData.school.name}</Text>
            <Text fontSize="large"> Email: {schoolData.school.email}</Text>
            <Text fontSize="large">College Name: {schoolData.collegeName}</Text>
            <Text fontSize="large"> Phone: {schoolData.school.phone}</Text>
          </Box>
          {isLoggedInSchool() && getLocalSchoolId() === schoolId && (
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
