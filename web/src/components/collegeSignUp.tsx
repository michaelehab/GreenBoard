import {
  Box,
  Button,
  Flex,
  Input,
  Alert,
  AlertIcon,
  Center,
  Heading,
  Image
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import collegeVector from "../assets/collegesAdmins.jpg"
import { useTitle } from "../utils/useTitle";
import { isLoggedIn, collegeSignUp } from "../utils/auth";
import { ApiError } from "../utils/apiError";

export const CollegeSignUp = () => {
  useTitle("Sign Up");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [foundedAt, setFoundedAt] = useState(new Date().getFullYear());
  const [confirmAdminPassWord, setConfirmAdminPassWord] = useState("");
  const [error, setError] = useState("");

  const signUp = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (
        name === "" ||
        location === "" ||
        phone === "" ||
        email === "" ||
        foundedAt === 0 ||
        adminPassword === ""
      ) {
        setError("Please make sure all the fields are not empty!");
      } else if (adminPassword !== confirmAdminPassWord) {
        setError("Confirm Password doesn't match password!");
      } else {
        try {
          await collegeSignUp(
            email,
            name,
            phone,
            foundedAt,
            location,
            adminPassword
          );
          navigate("/");
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [
      navigate,
      email,
      name,
      phone,
      foundedAt,
      location,
      adminPassword,
      confirmAdminPassWord,
    ]
  );

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Center flexDirection="column">
      <Heading color="#4d7e3e" my={2}>College Sign Up</Heading>
      <Image src={collegeVector} height={{ sm: "10rem", lg: "20rem" }} />
      <Flex maxW="sm" my={3} mx="auto" direction="column" gap={3}>
        <Flex gap={2}>
          <Input
            placeholder="College Name"
            value={name}
            variant="outline"
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="College Email"
            value={email}
            variant="outline"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Flex>

        <Input
          placeholder="College Phone"
          value={phone}
          type="number"
          variant="outline"
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          placeholder="College Location"
          value={location}
          variant="outline"
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          placeholder="Founded At"
          variant="outline"
          type="number"
          value={foundedAt}
          onChange={(e) => setFoundedAt(e.target.valueAsNumber)}
        />

        <Input
          placeholder="Admin Password"
          type="password"
          variant="outline"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />

        <Input
          placeholder="Confirm Admin Password"
          type="password"
          variant="outline"
          value={confirmAdminPassWord}
          onChange={(e) => setConfirmAdminPassWord(e.target.value)}
        />

        <Box m="auto">
          <Button
            colorScheme="green"
            variant="solid"
            type="submit"
            display="block"
            onClick={signUp}
          >
            Sign Up
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
