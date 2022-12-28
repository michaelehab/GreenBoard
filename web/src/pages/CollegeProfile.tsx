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
  isLoggedInCollege,
  isLoggedInInstructor,
} from "../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetCollegeRequest, GetCollegeResponse } from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
import { updateCollege } from "../utils/college";
export const CollegeProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const { collegeId } = useParams();

  const { data: collegeData } = useQuery([`viewCollegeProfile`], () =>
    callEndpoint<GetCollegeRequest, GetCollegeResponse>(
      `/college/${collegeId}`,
      "GET",
      true
    )
  );

  useEffect(() => {
    if (!isLoggedInCollege()) {
      navigate("/");
    }
  }, [navigate, collegeData]);

  if (!collegeData) {
    return <NotFound />;
  }

  return (
    <Center flexDirection="column">
      <Heading color="#4d7e3e">College Profile</Heading>

      <Flex maxW="sm" mx="auto" my={12} direction="column" gap={3}>
        <Box m="auto">
          <Text fontSize="large"> Name: {collegeData.college.name}</Text>
          <Text fontSize="large"> Email: {collegeData.college.email}</Text>
          <Text fontSize="large">
            Founded At: {collegeData.college.foundedAt}
          </Text>
          <Text fontSize="large">Location: {collegeData.college.location}</Text>
          <Text fontSize="large"> Phone: {collegeData.college.phone}</Text>
        </Box>
        {isLoggedInCollege() && getLocalCollegeId() === collegeId && (
          <Flex gap={2}>
            <Link to={`/colleges/edit`}>
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
    </Center>
  );
};
