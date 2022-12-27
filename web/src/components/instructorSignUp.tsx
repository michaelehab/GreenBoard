import { Box, Button, Flex, Input, Alert, AlertIcon } from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { ApiError } from "../utils/apiError";
import {
  getLocalDepartmentId,
  instructorSignUp,
  isLoggedInDepartment,
} from "../utils/auth";

export const InstructorSignUp = () => {
  useTitle("Sign Up");
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const departmentId: string = getLocalDepartmentId();

  const signUp = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (departmentId === "") setError("Please signin department first");
      if (
        password === "" ||
        phone === "" ||
        lastName === "" ||
        firstName === "" ||
        email === "" ||
        confirmPassword === ""
      ) {
        setError("Please make sure all the fields are not empty!");
      } else if (password !== confirmPassword) {
        setError("Confirm Password doesn't match password!");
      } else {
        try {
          await instructorSignUp(
            email,
            firstName,
            lastName,
            phone,
            password,
            departmentId
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
      firstName,
      lastName,
      phone,
      password,
      confirmPassword,
      departmentId,
    ]
  );
  useEffect(() => {
    if (!isLoggedInDepartment()) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <form onSubmit={signUp}>
      <Flex maxW="sm" my={3} mx="auto" direction="column" gap={3}>
        <Flex gap={2}>
          <Input
            placeholder="First Name"
            value={firstName}
            variant="outline"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            variant="outline"
            onChange={(e) => setLastName(e.target.value)}
          />
        </Flex>

        <Input
          placeholder="Instructor Email"
          value={email}
          variant="outline"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Instructor Phone"
          value={phone}
          type="number"
          variant="outline"
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          placeholder="Password"
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
    </form>
  );
};
