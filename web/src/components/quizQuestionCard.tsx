import {
  Text,
  Center,
  Box,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { QuizQuestion } from "@greenboard/shared";
import { Link } from "react-router-dom";

export const QuizQuestionCard: React.FC<Partial<QuizQuestion>> = (
  quizQuestion
) => {
  return (
    <Card w={500}>
      <CardHeader>Question: {quizQuestion.question}</CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Text>ChoiceA: {quizQuestion.choiceA}</Text>
          <Text>ChoiceB: {quizQuestion.choiceB}</Text>
          <Text>ChoiceC: {quizQuestion.choiceC}</Text>
          <Text>ChoiceD: {quizQuestion.choiceD}</Text>
          <Text>Right Choice: {quizQuestion.rightChoice}</Text>
          <Text>Question Weight: {quizQuestion.weight}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
};
