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
import { isLoggedIn } from "../utils/auth";
import { createCourse } from "../utils/course";
import { useNavigate } from "react-router-dom";

export const CreateCourse = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const create = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (
        code === "" ||
        name === "" ||
        password === "" ||
        confirmPassword === ""
      ) {
        setError("All fields are required!");
      } else if (password !== confirmPassword) {
        setError("Confirm Password doesn't match password!");
      } else {
        try {
          await createCourse(code, name, password);
          navigate("/");
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, code, name, password, confirmPassword]
  );

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <form onSubmit={create}>
      <Center>
        <Heading color="#4d7e3e">Create Course</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Course Name"
          value={name}
          variant="outline"
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Course Code"
          variant="outline"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <Input
          placeholder="Course Password"
          type="password"
          variant="outline"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          placeholder="Confirm Password"
          type="password"
          variant="outline"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Box m="auto">
          <Button
            colorScheme="green"
            variant="solid"
            type="submit"
            display="block"
            onClick={create}
          >
            Create
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
