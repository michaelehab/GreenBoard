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
import {
  getLocalCollegeId,
  getLocalSchoolId,
  isLoggedInCollege,
  isLoggedInInstructor,
  isLoggedInSchool,
} from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  GetCollegeRequest,
  GetCollegeResponse,
  GetSchoolRequest,
  GetSchoolResponse,
} from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
import { updateCollege } from "../utils/college";
import { updateSchool } from "../utils/school";
export const EditSchoolProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const update = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (name === "" || email === "" || phone === "") {
        setError("All fields are required!");
      } else {
        try {
          await updateSchool(name, email, phone);
          navigate(`/schools/${getLocalSchoolId()}`);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, name, email, phone]
  );
  const { data: schoolData } = useQuery([`viewSchoolProfile`], () =>
    callEndpoint<GetSchoolRequest, GetSchoolResponse>(
      `/schools/${getLocalSchoolId()}`,
      "GET",
      true
    )
  );
  useEffect(() => {
    if (!isLoggedInSchool()) {
      navigate("/");
    }
    if (schoolData) {
      setName(schoolData?.school.name);
      setEmail(schoolData?.school.email);
      setPhone(schoolData?.school.phone);
    }
  }, [navigate, schoolData]);

  if (!schoolData) {
    return <NotFound />;
  }

  return (
    <form onSubmit={update}>
      <Center>
        <Heading color="#4d7e3e">School Profile</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="School Name"
          value={name}
          variant="outline"
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="School Email"
          variant="outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="School Phone"
          variant="outline"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
