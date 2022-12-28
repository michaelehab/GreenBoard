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
import { getLocalDepartmentId, isLoggedInDepartment } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  GetDepartmentRequest,
  GetDepartmentResponse,
} from "@greenboard/shared";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
import { updateDepartment } from "../utils/department";
export const EditDepartmentProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const update = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (name === "" || email === "") {
        setError("All fields are required!");
      } else {
        try {
          await updateDepartment(name, email);
          navigate(`/departments/${getLocalDepartmentId()}`);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, name, email]
  );
  const { data: departmentData } = useQuery([`viewDepartmentProfile`], () =>
    callEndpoint<GetDepartmentRequest, GetDepartmentResponse>(
      `/departments/${getLocalDepartmentId()}`,
      "GET",
      true
    )
  );
  useEffect(() => {
    if (!isLoggedInDepartment()) {
      navigate("/");
    }
    if (departmentData) {
      setName(departmentData.department.name);
      setEmail(departmentData.department.email);
    }
  }, [navigate, departmentData]);

  if (!departmentData) {
    return <NotFound />;
  }

  return (
    <form onSubmit={update}>
      <Center>
        <Heading color="#4d7e3e">Department Profile</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Department Name"
          value={name}
          variant="outline"
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Department Email"
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
