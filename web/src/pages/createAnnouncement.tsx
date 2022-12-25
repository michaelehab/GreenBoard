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
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError } from "../utils/apiError";
import {
  isLoggedInCollege,
  isLoggedInDepartment,
  isLoggedInSchool,
} from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { createAnnouncement } from "../utils/announcement";
export const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const create = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (title === "" || content === "") {
        setError("All fields are required!");
      } else {
        try {
          await createAnnouncement(title, content);
          navigate("/");
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, title, content]
  );

  useEffect(() => {
    if (
      !isLoggedInCollege() &&
      !isLoggedInSchool() &&
      !isLoggedInDepartment()
    ) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <form onSubmit={create}>
      <Center>
        <Heading color="#4d7e3e">Create Announcement</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Title"
          value={title}
          variant="outline"
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Content"
          variant="outline"
          height={60}
          value={content}
          resize="none"
          onChange={(e) => setContent(e.target.value)}
        />

        <Box m="auto">
          <Button
            colorScheme="green"
            variant="solid"
            type="submit"
            display="block"
            onClick={create}
          >
            Create
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
