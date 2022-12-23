import { Box, Button, Flex, Input, Alert, AlertIcon } from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import {
  isLoggedIn,
  LOCAL_STORAGE_CollegeID,
  schoolSignUp,
} from "../utils/auth";
import { ApiError } from "../utils/apiError";

export const SchoolSignUp = () => {
  useTitle("Sign Up");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmAdminPassWord, setConfirmAdminPassWord] = useState("");
  const [error, setError] = useState("");
  const [collegeId] = useState(LOCAL_STORAGE_CollegeID);
  const signUp = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (collegeId === "") setError("Please signin college first");
      if (name === "" || phone === "" || email === "" || adminPassword === "") {
        setError("Please make sure all the fields are not empty!");
      } else if (adminPassword !== confirmAdminPassWord) {
        setError("Confirm Password doesn't match password!");
      } else {
        try {
          await schoolSignUp(email, name, phone, collegeId, adminPassword);
          navigate("/");
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, email, name, phone, adminPassword, confirmAdminPassWord]
  );
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <form onSubmit={signUp}>
      <Flex maxW="sm" my={3} mx="auto" direction="column" gap={3}>
        <Flex gap={2}>
          <Input
            placeholder="School Name"
            value={name}
            variant="outline"
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="School Email"
            value={email}
            variant="outline"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Flex>

        <Input
          placeholder="School Phone"
          value={phone}
          type="number"
          variant="outline"
          onChange={(e) => setPhone(e.target.value)}
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
    </form>
  );
};
