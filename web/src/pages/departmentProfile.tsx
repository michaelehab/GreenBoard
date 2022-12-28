import { Box, Button, Flex, Heading, Center, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { getLocalDepartmentId, isLoggedInDepartment } from "../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  GetDepartmentRequest,
  GetDepartmentResponse,
} from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
export const DepartmentProfile = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();

  const { data: departmentData } = useQuery([`viewDepartmentProfile`], () =>
    callEndpoint<GetDepartmentRequest, GetDepartmentResponse>(
      `/departments/${departmentId}`,
      "GET",
      true
    )
  );

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
              <Flex gap={2}>
                <Link to={`/departments/edit`}>
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
        </Flex>
      </Box>
    </Center>
  );
};
