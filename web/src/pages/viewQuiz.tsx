import {
  Box,
  Button,
  Flex,
  Text,
  Container,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  isLoggedInInstructor,
  isLoggedInStudent,
  isLoggedInUser,
} from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import { NotFound } from "./notFound";
import { GetQuizRequest, GetQuizResponse } from "@greenboard/shared";
import { submitQuiz } from "../utils/grade";
import { ApiError } from "../utils/apiError";
import { toggleQuiz } from "../utils/quiz";
import { QuizQuestionCard } from "../components/quizQuestionCard";

export const ViewQuiz = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAsnwers] = useState(Array<string>);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState(false);

  const { data: quizData, error: quizError } = useQuery(
    [`view${quizId}Quiz`],
    () =>
      callEndpoint<GetQuizRequest, GetQuizResponse>(
        `/courses/${courseId}/quizzes/${quizId}`,
        "GET",
        true
      )
  );

  const handleAnswerOptionClick = (choice: string) => {
    const nextQuestion = currentQuestion + 1;
    answers[currentQuestion] = choice;
    if (quizData && nextQuestion < quizData.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setConfirmSubmit(true);
    }
  };

  const previousQuestion = () => {
    setCurrentQuestion(Math.max(0, currentQuestion - 1));
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestion + 1;
    //@ts-ignore
    if (quizData && nextIndex < quizData.questions.length) {
      setCurrentQuestion(
        //@ts-ignore
        Math.min(quizData?.questions.length - 1, currentQuestion + 1)
      );
    } else {
      setConfirmSubmit(true);
    }
  };

  const backToQuestions = () => {
    setCurrentQuestion(0);
    setConfirmSubmit(false);
  };

  const submit = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      try {
        //@ts-ignore
        await submitQuiz(courseId, quizId, answers);
        navigate(`/courses/${courseId}/grades`);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        }
      }
    },
    [answers, courseId, navigate, quizId]
  );

  const toggleIsActive = async () => {
    // @ts-ignore
    const newActive = await toggleQuiz(courseId, quizId);
    setIsActive(newActive);
  };

  useEffect(() => {
    if (!isLoggedInUser()) {
      navigate("/");
    }
    if (quizData) {
      setIsActive(quizData.quiz.isActive);
    }
  }, [navigate, quizData]);

  if (!courseId || !quizData) {
    return <NotFound />;
  }

  if (quizError) {
    navigate(`/courses/${courseId}/grades`);
  }

  return (
    <Container>
      <Flex align="center" direction="column">
        <Box
          maxW="6xl"
          w={["sm", "xl", "3xl"]}
          m={5}
          boxShadow="xl"
          p="6"
          rounded="md"
          bg="white"
        >
          <Text fontSize="md" fontWeight="bold">
            {quizData.quiz.name}
          </Text>
          <Text fontSize="md">
            {new Date(quizData.quiz.quizDate).toDateString()}
          </Text>
          {isLoggedInInstructor() && (
            <Checkbox isChecked={isActive} onChange={(e) => toggleIsActive()}>
              Activate Quiz
            </Checkbox>
          )}
        </Box>
        {!confirmSubmit && isLoggedInStudent() && (
          <Box>
            <Text>{quizData.questions[currentQuestion].question}</Text>
            <Stack direction="column">
              <Button
                variant={answers[currentQuestion] === "A" ? "outline" : "solid"}
                onClick={() => handleAnswerOptionClick("A")}
              >
                {quizData.questions[currentQuestion].choiceA}
              </Button>
              <Button
                variant={answers[currentQuestion] === "B" ? "outline" : "solid"}
                onClick={() => handleAnswerOptionClick("B")}
              >
                {quizData.questions[currentQuestion].choiceB}
              </Button>
              <Button
                variant={answers[currentQuestion] === "C" ? "outline" : "solid"}
                onClick={() => handleAnswerOptionClick("C")}
              >
                {quizData.questions[currentQuestion].choiceC}
              </Button>
              <Button
                variant={answers[currentQuestion] === "D" ? "outline" : "solid"}
                onClick={() => handleAnswerOptionClick("D")}
              >
                {quizData.questions[currentQuestion].choiceD}
              </Button>
            </Stack>
            <Flex>
              <Button
                colorScheme="green"
                variant="solid"
                type="submit"
                display="block"
                m={1}
                onClick={previousQuestion}
              >
                Previous Question
              </Button>
              <Button
                colorScheme="green"
                variant="solid"
                type="submit"
                display="block"
                m={1}
                onClick={nextQuestion}
              >
                Next Question
              </Button>
            </Flex>
          </Box>
        )}
        {confirmSubmit && isLoggedInStudent() && (
          <Box>
            <Text>Are you sure you want to submit the quiz?</Text>
            <Button
              colorScheme="green"
              variant="solid"
              type="submit"
              display="block"
              m={1}
              onClick={backToQuestions}
            >
              Back to Questions
            </Button>
            <Button
              colorScheme="green"
              variant="solid"
              type="submit"
              display="block"
              m={1}
              onClick={submit}
            >
              Submit Quiz
            </Button>
          </Box>
        )}
        {isLoggedInInstructor() &&
          quizData.questions.map((question, i) => (
            <QuizQuestionCard key={i} {...question} />
          ))}
      </Flex>
    </Container>
  );
};
