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
import { isLoggedInInstructor, isLoggedInStudent } from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { createStudentQuestion } from "../utils/post";
export const CreateStudentQuestion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const { courseId } = useParams();

  const create = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (title === "" || url === "" || content === "") {
        setError("All fields are required!");
      } else {
        try {
          await createStudentQuestion(title, url, content, courseId);
          navigate(`/courses/${courseId}`);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, title, content, url]
  );

  useEffect(() => {
    if (!isLoggedInStudent()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <form onSubmit={create}>
      <Center>
        <Heading color="#4d7e3e">Ask</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Title"
          value={title}
          variant="outline"
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="URL"
          variant="outline"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
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
            Ask
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
