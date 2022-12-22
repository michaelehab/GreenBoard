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
import { useNavigate, useParams } from "react-router-dom";

export const JoinCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const join = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (!courseId) {
        navigate("/");
      } else if (courseId === "" || password === "" || confirmPassword === "") {
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
  }, [navigate, courseId]);

  return (
    <form onSubmit={join}>
      <Center>
        <Heading color="#4d7e3e">Join Course</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
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
            Join
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
