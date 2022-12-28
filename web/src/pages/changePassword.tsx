import {
  Box,
  Button,
  Flex,
  Input,
  Alert,
  AlertIcon,
  Heading,
  Center,
  Textarea,
  Container,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError } from "../utils/apiError";
import {
  getLocalCollegeId,
  getLocalDepartmentId,
  getLocalSchoolId,
  isLoggedIn,
  isLoggedInCollege,
  isLoggedInDepartment,
  isLoggedInSchool,
  updateCollegePassword,
  updateDepartmentPassword,
  updateSchoolPassword,
} from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";

export const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const update = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (
        currentPassword === "" ||
        newPassword === "" ||
        confirmNewPassword === ""
      ) {
        setError("All fields are required!");
      }
      if (newPassword !== confirmNewPassword) {
        setError("New Password must match confirm password");
      } else {
        try {
          if (isLoggedInCollege()) {
            await updateCollegePassword(currentPassword, newPassword);
            navigate(`/colleges/${getLocalCollegeId()}`);
          } else if (isLoggedInSchool()) {
            await updateSchoolPassword(currentPassword, newPassword);
            navigate(`/schools/${getLocalSchoolId()}`);
          } else if (isLoggedInDepartment()) {
            await updateDepartmentPassword(currentPassword, newPassword);
            navigate(`/departments/${getLocalDepartmentId()}`);
          }
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, currentPassword, newPassword, confirmNewPassword]
  );

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Center flexDirection="column">
      <Heading color="#4d7e3e">Change Password</Heading>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Current Password"
          value={currentPassword}
          variant="outline"
          type="password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <Input
          placeholder="New Password"
          variant="outline"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Input
          placeholder="Confirm New Password"
          variant="outline"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        <Box m="auto">
          <Button
            colorScheme="green"
            variant="solid"
            type="submit"
            display="block"
            onClick={update}
          >
            Change Password
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
