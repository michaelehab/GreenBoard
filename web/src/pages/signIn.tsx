import {
  Box,
  Button,
  Flex,
  Input,
  Alert,
  AlertIcon,
  Heading,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "../utils/useTitle";
import { isLoggedIn, collegeSignIn, schoolSignIn } from "../utils/auth";

export const SignIn = () => {
  useTitle("Sign in");
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

  const trySchoolSignin = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (email === "" || passWord === "") {
        setError("Email or password can't be empty!");
      } else {
        try {
          await schoolSignIn(email, passWord);
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
    <Tabs>
      <TabList>
        <Tab>College</Tab>
        <Tab>School</Tab>
        <Tab>Department</Tab>
        <Tab>Instructor</Tab>
        <Tab>Student</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
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
        </TabPanel>
        <TabPanel>
          <form onSubmit={trySchoolSignin}>
            <Center>
              <Heading color="#31C48D">School Sign In</Heading>
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
                  onClick={trySchoolSignin}
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
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
