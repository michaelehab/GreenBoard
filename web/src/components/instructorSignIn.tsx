import {
  Box,
  Button,
  Flex,
  Input,
  Alert,
  AlertIcon,
  Heading,
  Center,
  Image,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../utils/apiError";
import { isLoggedIn, instructorSignIn } from "../utils/auth";
import instructorVector from "../assets/instructors.jpg";

export const InstructorSignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [error, setError] = useState("");

  const signIn = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (email === "" || passWord === "") {
        setError("Email or password can't be empty!");
      } else {
        try {
          await instructorSignIn(email, passWord);
          navigate("/");
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, email, passWord]
  );

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Center flexDirection="column">
      <Heading color="#4d7e3e" my={2}>
        Instructor Sign In
      </Heading>
      <Image src={instructorVector} height={{ sm: "10rem", lg: "20rem" }} />
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Email"
          value={email}
          variant="outline"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          variant="outline"
          type="password"
          value={passWord}
          onChange={(e) => setPassWord(e.target.value)}
        />

        <Box m="auto">
          <Button
            colorScheme="green"
            variant="solid"
            type="submit"
            display="block"
            onClick={signIn}
          >
            Sign in
          </Button>
        </Box>

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
