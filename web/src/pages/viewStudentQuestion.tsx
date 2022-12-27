import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Input,
  Center,
  Text,
  Link as ChakraLink,
  Stack,
  Heading,
  AvatarGroup,
  Avatar,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  isLoggedIn,
  isLoggedInInstructor,
  isLoggedInUser,
} from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import { CommentCard } from "../components/commentCard";
import { NotFound } from "./notFound";
import {
  GetCourseStudentQuestionRequest,
  GetCourseStudentQuestionResponse,
  ListInstructorsAnswersRequest,
  ListInstructorsAnswersResponse,
  CreateInstructorAnswerRequest,
  CreateInstructorAnswerResponse,
} from "@greenboard/shared";
import { format } from "timeago.js";

export const ViewStudentQuestion = () => {
  const { courseId, questionId } = useParams();
  const [comment, setAnswer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedInUser()) {
      navigate("/");
    }
  }, [navigate]);

  const { data: questionData } = useQuery([`view${questionId}question`], () =>
    callEndpoint<
      GetCourseStudentQuestionRequest,
      GetCourseStudentQuestionResponse
    >(`/courses/${courseId}/questions/${questionId}`, "GET", true)
  );

  const { data: answersData, refetch: refetchComments } = useQuery(
    [`list${questionId}answer`],
    () =>
      callEndpoint<
        ListInstructorsAnswersRequest,
        ListInstructorsAnswersResponse
      >(`/courses/${courseId}/question/${questionId}/answer`, "GET", true)
  );

  const addAnswer = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (comment === "") {
        setError("Answer can't be empty");
      } else {
        await callEndpoint<
          CreateInstructorAnswerRequest,
          CreateInstructorAnswerResponse
        >(`/courses/${courseId}/question/${questionId}/answer`, "POST", true, {
          comment,
        });
        setAnswer("");
        refetchComments();
      }
    },
    [comment, refetchComments, courseId, questionId]
  );

  if (!courseId || !questionData || !questionId) {
    return <NotFound />;
  }

  return (
    <Center flexDirection="column">
      <Box
        maxW="6xl"
        w={["sm", "xl", "3xl"]}
        m={5}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
      >
        <Stack direction="row" alignItems="center">
          <Heading as="h3" size="lg">
            {questionData.question.title}
          </Heading>
          {questionData.question.url !== "NoLink" && (
            <ChakraLink color="#4d7e3e" href={questionData.question.url}>
              (Visit Link)
            </ChakraLink>
          )}
        </Stack>

        <Text fontSize="md">{questionData.question.content}</Text>

        <Flex justifyContent="space-between">
          <Stack direction="row" alignItems="center">
            <AvatarGroup spacing="1rem">
              <Avatar bg="teal.500" size={"sm"} />
            </AvatarGroup>
            <Text fontSize="md">
              {questionData.question.firstName} {questionData.question.lastName}
            </Text>
          </Stack>
          <Text>{format(questionData.question.postedAt, "en_US")}</Text>
        </Flex>
      </Box>
      <Flex direction="column">
        {!!answersData && answersData.InstructorDataAndAnswer.length > 0 ? (
          answersData.InstructorDataAndAnswer.map((c, i) => (
            <CommentCard key={i} {...c} />
          ))
        ) : (
          <Center>No answers on this question</Center>
        )}
      </Flex>
      {isLoggedIn() && isLoggedInInstructor() && (
        <Box>
          <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
            <Input
              placeholder="Enter Your Answer"
              value={comment}
              variant="outline"
              onChange={(e) => setAnswer(e.target.value)}
            />

            <Box m="auto">
              <Button
                colorScheme="green"
                variant="solid"
                type="submit"
                display="block"
                onClick={addAnswer}
              >
                Add Answer
              </Button>
            </Box>

            {!!error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </Flex>
        </Box>
      )}
    </Center>
  );
};
