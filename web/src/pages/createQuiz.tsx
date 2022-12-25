import {
  Button,
  Flex,
  Input,
  Alert,
  AlertIcon,
  Heading,
  Center,
  Checkbox,
  Container,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { isLoggedInInstructor } from "../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { createQuiz } from "../utils/quiz";
import { ApiError } from "../utils/apiError";
import { QuizQuestion } from "@greenboard/shared";

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quizDate, setQuizDate] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");

  const newQuestion = (
    n: number
  ): Pick<
    QuizQuestion,
    | "question_number"
    | "question"
    | "choiceA"
    | "choiceB"
    | "choiceC"
    | "choiceD"
    | "rightChoice"
    | "weight"
  > => {
    return {
      question: "",
      choiceA: "",
      choiceB: "",
      choiceC: "",
      choiceD: "",
      rightChoice: "",
      weight: 1,
      question_number: n,
    };
  };
  const [formFields, setFormFields] = useState([newQuestion(1)]);

  const { courseId } = useParams();

  useEffect(() => {
    if (!isLoggedInInstructor()) {
      navigate("/");
    }
  }, [navigate]);

  const create = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      console.log(formFields);
      if (name === "" || quizDate === "") {
        setError("All fields are required!");
      }
      if (courseId === undefined) {
        setError("Course ID is invalid");
      } else {
        try {
          await createQuiz(
            courseId,
            name,
            isActive,
            new Date(quizDate),
            formFields
          );
          navigate(`/courses/${courseId}`);
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message);
          }
        }
      }
    },
    [navigate, name, isActive, quizDate, formFields, courseId]
  );

  const addFields = () => {
    setFormFields([...formFields, newQuestion(formFields.length + 1)]);
  };

  const removeFields = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const setQuestionAttribute = (
    index: number,
    attribute: string,
    value: string
  ) => {
    let data = [...formFields];
    // @ts-ignore
    data[index][attribute] = value;
    setFormFields(data);
  };

  const setQuestionWeight = (index: number, value: number) => {
    let data = [...formFields];
    data[index]["weight"] = value;
    setFormFields(data);
  };

  return (
    <Container>
      <Center>
        <Heading color="#4d7e3e">Create Quiz</Heading>
      </Center>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
        <Input
          placeholder="Quiz Name"
          value={name}
          variant="outline"
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Quiz Date"
          variant="outline"
          value={quizDate}
          type="date"
          onChange={(e) => setQuizDate(e.target.value)}
        />

        <Checkbox
          isChecked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        >
          Activate Quiz
        </Checkbox>

        {formFields.map((form, index) => {
          return (
            <div key={index}>
              <Input
                placeholder={`Question ${index + 1}`}
                value={form.question}
                variant="outline"
                name="question"
                onChange={(e) =>
                  setQuestionAttribute(index, "question", e.target.value)
                }
              />
              <Input
                placeholder={`Q${index + 1} Choice A`}
                value={form.choiceA}
                variant="outline"
                name="choiceA"
                onChange={(e) =>
                  setQuestionAttribute(index, "choiceA", e.target.value)
                }
              />
              <Input
                placeholder={`Q${index + 1} Choice B`}
                value={form.choiceB}
                variant="outline"
                name="choiceB"
                onChange={(e) =>
                  setQuestionAttribute(index, "choiceB", e.target.value)
                }
              />
              <Input
                placeholder={`Q${index + 1} Choice C`}
                value={form.choiceC}
                variant="outline"
                name="choiceC"
                onChange={(e) =>
                  setQuestionAttribute(index, "choiceC", e.target.value)
                }
              />
              <Input
                placeholder={`Q${index + 1} Choice D`}
                value={form.choiceD}
                variant="outline"
                name="choiceD"
                onChange={(e) =>
                  setQuestionAttribute(index, "choiceD", e.target.value)
                }
              />
              <Input
                placeholder={`Q${index + 1} Right Choice`}
                value={form.rightChoice}
                variant="outline"
                name="rightChoice"
                onChange={(e) =>
                  setQuestionAttribute(index, "rightChoice", e.target.value)
                }
              />
              <Input
                placeholder={`Q${index + 1} Weight`}
                value={form.weight}
                variant="outline"
                name="weight"
                type="number"
                onChange={(e) =>
                  setQuestionWeight(index, e.target.valueAsNumber)
                }
              />

              <Button
                colorScheme="red"
                variant="solid"
                type="submit"
                display="block"
                m="auto"
                onClick={() => removeFields(index)}
              >
                Remove Question
              </Button>
            </div>
          );
        })}

        <Flex>
          <Button
            colorScheme="green"
            variant="solid"
            type="submit"
            display="block"
            onClick={create}
            m="auto"
          >
            Create Quiz
          </Button>
          <Button
            colorScheme="green"
            variant="solid"
            type="submit"
            display="block"
            onClick={addFields}
            m="auto"
          >
            Add Question
          </Button>
        </Flex>

        {!!error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
      </Flex>
    </Container>
  );
};
