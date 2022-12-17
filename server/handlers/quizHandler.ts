import { ExpressHandlerWithParams } from "../types";
import {
  CreateQuizRequest,
  CreateQuizResponse,
  Quiz,
  QuizQuestion,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";

export const CreateQuiz: ExpressHandlerWithParams<
  { courseId: string },
  CreateQuizRequest,
  CreateQuizResponse
> = async (req, res) => {
  const { quiz, questions } = req.body;
  if (!quiz || !questions) {
    return res.status(400).send({ error: "All fields are required" });
  }

  if (!quiz.name || !quiz.quizDate) {
    return res.status(400).send({ error: "All fields are required" });
  }

  for (let i = 0; i < questions.length; i++) {
    if (
      !questions[i].choiceA ||
      !questions[i].choiceB ||
      !questions[i].choiceC ||
      !questions[i].choiceD ||
      !questions[i].question ||
      !questions[i].question_number ||
      !questions[i].rightChoice ||
      !questions[i].weight
    ) {
      return res.status(400).send({ error: "All fields are required" });
    }
  }

  if (!req.params.courseId) {
    return res.status(400).send({ error: "CourseId is required" });
  }

  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }

  const existingInstructor = await db.getInstructorById(res.locals.userId);
  if (!existingInstructor) {
    return res.status(403).send({ error: "Instructor is not valid" });
  }

  const existingEnrollment = await db.checkEnrollment(
    existingInstructor.id,
    req.params.courseId
  );

  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }

  const quiz1: Quiz = {
    id: crypto.randomBytes(20).toString("hex"),
    name: quiz.name,
    quizDate: quiz.quizDate,
    isActive: quiz.isActive,
    courseId: req.params.courseId,
  };

  await db.createQuiz(quiz1);

  let questionNumX: QuizQuestion;

  let questionsArr: QuizQuestion[] = [];
  for (let i = 0; i < questions.length; i++) {
    questionNumX = {
      question_number: questions[i].question_number,
      question: questions[i].question,
      choiceA: questions[i].choiceA,
      choiceB: questions[i].choiceB,
      choiceC: questions[i].choiceC,
      choiceD: questions[i].choiceD,
      rightChoice: questions[i].rightChoice,
      quizId: quiz1.id,
      weight: questions[i].weight,
    };
    questionsArr.push(questionNumX);
    await db.createQuizQuestion(questionNumX);
  }
  return res.status(200).send({
    quiz: quiz1,
    questions: questionsArr,
  });
};
