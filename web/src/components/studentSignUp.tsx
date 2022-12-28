import { Box, Button, Flex, Input, Alert, AlertIcon } from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { ApiError } from "../utils/apiError";
import {
  getLocalDepartmentId,
  studentSignUp,
  isLoggedInDepartment,
} from "../utils/auth";
export const StudentSignUp = () => {
  useTitle("Sign Up");
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const departmentId: string = getLocalDepartmentId();

  const signUp = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (departmentId === "") setError("Please signin department first");
      if (
        confirmPassword === "" ||
        phone === "" ||
        lastName === "" ||
        firstName === "" ||
        email === "" ||
        password === "" ||
        level === 0
      ) {
        setError("Please make sure all the fields are not empty!");
      } else if (password !== confirmPassword) {
        setError("Confirm Password doesn't match password!");
      } else {
        try {
          await studentSignUp(
            email,
            firstName,
            lastName,
            phone,
            level,
            password,
            departmentId
          );
          setSuccess("Student Registered Successfully");
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [
      email,
      firstName,
      lastName,
      phone,
      level,
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
          placeholder="Student Email"
          value={email}
          variant="outline"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Student Phone"
          value={phone}
          type="number"
          variant="outline"
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          placeholder="Student Level"
          value={level}
          type="number"
          variant="outline"
          onChange={(e) => setLevel(e.target.valueAsNumber)}
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
        {!!success && (
          <Alert status="success">
            <AlertIcon />
            {success}
          </Alert>
        )}
      </Flex>
    </form>
  );
};
