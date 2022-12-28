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
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError } from "../utils/apiError";
import { getLocalUserId, isLoggedInStudent } from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetStudentRequest, GetStudentResponse } from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
import { updateStudent } from "../utils/student";
export const EditStudentProfile = () => {
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
          await updateStudent(firstName, lastName, phoneNumber, email);
          navigate(`/students/${getLocalUserId()}`);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, firstName, lastName, phoneNumber, email]
  );
  const { data: studentData } = useQuery([`viewStudentProfile`], () =>
    callEndpoint<GetStudentRequest, GetStudentResponse>(
      `/students/${getLocalUserId()}`,
      "GET",
      true
    )
  );
  useEffect(() => {
    if (!isLoggedInStudent()) {
      navigate("/");
    }
    if (studentData) {
      setFirstName(studentData.student.firstName);
      setLastName(studentData.student.lastName);
      setPhoneNumber(studentData.student.phoneNumber);
      setEmail(studentData.student.email);
    }
  }, [navigate, studentData]);

  if (!studentData) {
    return <NotFound />;
  }

  return (
    <form onSubmit={update}>
      <Center>
        <Heading color="#4d7e3e">Student Profile</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="student First Name"
          value={firstName}
          variant="outline"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="student Last Name"
          value={lastName}
          variant="outline"
          onChange={(e) => setLastName(e.target.value)}
        />

        <Input
          placeholder="student Phone Number"
          value={phoneNumber}
          variant="outline"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <Input
          placeholder="student Email"
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
