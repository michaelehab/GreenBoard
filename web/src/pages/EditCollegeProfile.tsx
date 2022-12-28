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
import { getLocalCollegeId, isLoggedInCollege } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetCollegeRequest, GetCollegeResponse } from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
import { updateCollege } from "../utils/college";
export const EditCollegeProfile = () => {
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
          await updateCollege(name, email, phone);
          navigate(`/colleges/${getLocalCollegeId()}`);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, name, email, phone]
  );
  const { data: collegeData } = useQuery([`viewCollegeProfile`], () =>
    callEndpoint<GetCollegeRequest, GetCollegeResponse>(
      `/colleges/${getLocalCollegeId()}`,
      "GET",
      true
    )
  );
  useEffect(() => {
    if (!isLoggedInCollege()) {
      navigate("/");
    }
    if (collegeData) {
      setName(collegeData?.college.name);
      setEmail(collegeData?.college.email);
      setPhone(collegeData?.college.phone);
    }
  }, [navigate, collegeData]);

  if (!collegeData) {
    return <NotFound />;
  }

  return (
    <form onSubmit={update}>
      <Center>
        <Heading color="#4d7e3e">College Profile</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="College Name"
          value={name}
          variant="outline"
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="College Email"
          variant="outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="College Phone"
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
