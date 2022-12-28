import {
  Box,
  Button,
  Flex,
  Input,
  Alert,
  AlertIcon,
  Heading,
  Center,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError } from "../utils/apiError";
import { getLocalUserId, isLoggedInInstructor } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
import { updateInstructor } from "../utils/instructor";
import {
  GetInstructorRequest,
  GetInstructorResponse,
} from "@greenboard/shared";
export const EditInstructorProfile = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const update = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (
        firstName === "" ||
        lastName === "" ||
        phoneNumber === "" ||
        email === ""
      ) {
        setError("All fields are required!");
      } else {
        try {
          await updateInstructor(firstName, lastName, phoneNumber, email);
          navigate(`/instructors/${getLocalUserId()}`);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, firstName, lastName, phoneNumber, email]
  );
  const { data: instructorData } = useQuery([`viewInstructorProfile`], () =>
    callEndpoint<GetInstructorRequest, GetInstructorResponse>(
      `/instructors/${getLocalUserId()}`,
      "GET",
      true
    )
  );
  useEffect(() => {
    if (!isLoggedInInstructor()) {
      navigate("/");
    }
    if (instructorData) {
      setFirstName(instructorData.instructor.firstName);
      setLastName(instructorData.instructor.lastName);
      setPhoneNumber(instructorData.instructor.phoneNumber);
      setEmail(instructorData.instructor.email);
    }
  }, [navigate, instructorData]);

  if (!instructorData) {
    return <NotFound />;
  }

  return (
    <form onSubmit={update}>
      <Center>
        <Heading color="#4d7e3e">Instructor Profile</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="instructor First Name"
          value={firstName}
          variant="outline"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="instructor Last Name"
          value={lastName}
          variant="outline"
          onChange={(e) => setLastName(e.target.value)}
        />

        <Input
          placeholder="instructor Phone Number"
          value={phoneNumber}
          variant="outline"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <Input
          placeholder="instructor Email"
          variant="outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Box m="auto">
          <Button
            colorScheme="green"
            variant="solid"
            type="submit"
            display="block"
            onClick={update}
          >
            Edit
          </Button>
        </Box>

        {!!error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
      </Flex>
    </form>
  );
};
