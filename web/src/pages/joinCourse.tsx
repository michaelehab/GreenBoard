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
import { isLoggedInUser } from "../utils/auth";
import { joinCourse } from "../utils/course";
import { useNavigate } from "react-router-dom";

export const JoinCourse = () => {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const join = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (courseId === "" || password === "" || confirmPassword === "") {
        setError("All fields are required!");
      } else if (password !== confirmPassword) {
        setError("Confirm Password doesn't match password!");
      } else {
        try {
          await joinCourse(courseId, password);
          navigate("/");
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, courseId, password, confirmPassword]
  );

  useEffect(() => {
    if (!isLoggedInUser()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <form onSubmit={join}>
      <Center>
        <Heading color="#4d7e3e">Join Course</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Course ID"
          value={courseId}
          variant="outline"
          onChange={(e) => setCourseId(e.target.value)}
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
            onClick={join}
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
