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
import { useNavigate } from "react-router-dom";
import { isLoggedIn, collegeSignIn } from "../utils/auth";

export const CollegeSignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [error, setError] = useState("");

  const tryCollegeSignin = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (email === "" || passWord === "") {
        setError("Email or password can't be empty!");
      } else {
        try {
          await collegeSignIn(email, passWord);
          navigate("/");
        } catch (err) {
          setError(err as string);
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
    <form onSubmit={tryCollegeSignin}>
      <Center>
        <Heading color="#31C48D">College Sign In</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Username or email"
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
            onClick={tryCollegeSignin}
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
    </form>
  );
};
