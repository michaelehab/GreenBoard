import { Box, Button, Flex, Input, Alert, AlertIcon } from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { ApiError } from "../utils/apiError";
import { isLoggedIn, getLocalDepartmentId, studentSignUp } from "../utils/auth";
export const StudentSignUp = () => {
  useTitle("Sign Up");
  const navigate = useNavigate();
  const [Firstname, setFirstName] = useState("");
  const [Lastname, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [level, setlevel] = useState(0);
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmAdminPassWord, setConfirmAdminPassWord] = useState("");
  const departmentId: string = getLocalDepartmentId();
  const [error, setError] = useState("");

  const signUp = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (departmentId === "") setError("Please signin department first");
      if (
        confirmAdminPassWord === "" ||
        phone === "" ||
        Lastname === "" ||
        Firstname === "" ||
        email === "" ||
        adminPassword === "" ||
        level === 0
      ) {
        setError("Please make sure all the fields are not empty!");
      } else if (adminPassword !== confirmAdminPassWord) {
        setError("Confirm Password doesn't match password!");
      } else {
        try {
          await studentSignUp(
            email,
            Firstname,
            Lastname,
            phone,
            level,
            adminPassword,
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
      Firstname,
      Lastname,
      phone,
      level,
      adminPassword,
      confirmAdminPassWord,
      departmentId,
    ]
  );
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <form onSubmit={signUp}>
      <Flex maxW="sm" my={3} mx="auto" direction="column" gap={3}>
        <Flex gap={2}>
          <Input
            placeholder="First Name"
            value={Firstname}
            variant="outline"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Last Name"
            value={Lastname}
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
          onChange={(e) => setlevel(e.target.valueAsNumber)}
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