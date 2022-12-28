import { Box, Button, Flex, Heading, Center, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { getLocalSchoolId, isLoggedInSchool } from "../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetSchoolRequest, GetSchoolResponse } from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
export const SchoolProfile = () => {
  const navigate = useNavigate();
  const { schoolId } = useParams();

  const { data: schoolData } = useQuery([`viewSchoolProfile`], () =>
    callEndpoint<GetSchoolRequest, GetSchoolResponse>(
      `/schools/${schoolId}`,
      "GET",
      true
    )
  );

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
            <Text fontSize="large">Name: {schoolData.school.name}</Text>
            <Text fontSize="large">Email: {schoolData.school.email}</Text>
            <Text fontSize="large">College Name: {schoolData.collegeName}</Text>
            <Text fontSize="large">Phone: {schoolData.school.phone}</Text>
          </Box>
          {isLoggedInSchool() && getLocalSchoolId() === schoolId && (
            <Flex gap={2}>
              <Link to={`/schools/edit`}>
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
