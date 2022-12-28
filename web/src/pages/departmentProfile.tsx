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
  getLocalDepartmentId,
  getLocalSchoolId,
  isLoggedInCollege,
  isLoggedInDepartment,
  isLoggedInInstructor,
  isLoggedInSchool,
} from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  GetDepartmentRequest,
  GetDepartmentResponse,
  GetSchoolRequest,
  GetSchoolResponse,
} from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
export const DepartmentProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { departmentId } = useParams();

  const { data: departmentData } = useQuery([`viewDepartmentProfile`], () =>
    callEndpoint<GetDepartmentRequest, GetDepartmentResponse>(
      `/department/${departmentId}`,
      "GET",
      true
    )
  );
  const edit = () => {
    navigate(`/department/edit`);
  };
  useEffect(() => {
    if (!isLoggedInDepartment()) {
      navigate("/");
    }
  }, [navigate, departmentData]);

  if (!departmentData) {
    return <NotFound />;
  }

  return (
    <Center>
      <Box>
        <Heading color="#4d7e3e">Department Profile</Heading>

        <Flex maxW="sm" mx="auto" my={12} direction="column" gap={3}>
          <Box m="auto">
            <Text fontSize="large">
              {" "}
              Name: {departmentData.department.name}
            </Text>
            <Text fontSize="large">
              {" "}
              Email: {departmentData.department.email}
            </Text>
            <Text fontSize="large">
              School Name: {departmentData.schoolName}
            </Text>
          </Box>
          {isLoggedInDepartment() &&
            getLocalDepartmentId() === departmentId && (
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
