import { Box, Button, Flex, Input, Alert, AlertIcon } from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { ApiError } from "../utils/apiError";
import {
  departmentSignUp,
  getLocalSchoolId,
  isLoggedInSchool,
} from "../utils/auth";
export const DepartmentSignUp = () => {
  useTitle("Sign Up");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmAdminPassWord, setConfirmAdminPassWord] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const schoolId: string = getLocalSchoolId();

  const signUp = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (name === "" || email === "" || adminPassword === "") {
        setSuccess("");
        setError("Please make sure all the fields are not empty!");
      } else if (adminPassword !== confirmAdminPassWord) {
        setSuccess("");
        setError("Confirm Password doesn't match password!");
      } else {
        try {
          await departmentSignUp(email, name, schoolId, adminPassword);
          setError("");
          setSuccess("Department Registered Successfully");
        } catch (err) {
          if (err instanceof ApiError) {
            setSuccess("");
            setError(err.message);
          }
        }
      }
    },
    [email, name, adminPassword, confirmAdminPassWord, schoolId]
  );
  useEffect(() => {
    if (!isLoggedInSchool()) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <form onSubmit={signUp}>
      <Flex maxW="sm" my={3} mx="auto" direction="column" gap={3}>
        <Flex gap={2}>
          <Input
            placeholder="Department Name"
            value={name}
            variant="outline"
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Department Email"
            value={email}
            variant="outline"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Flex>

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
