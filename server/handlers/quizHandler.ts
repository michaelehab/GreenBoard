import { ExpressHandlerWithParams } from "../types";
import {
  CreateQuizRequest,
  CreateQuizResponse,
  Quiz,
  QuizQuestion,
  GetQuizRequest,
  GetQuizResponse,
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

  if (!quiz.name || !quiz.quizDate || quiz.isActive === undefined) {
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

export const getQuiz: ExpressHandlerWithParams<
  { courseId: string; quizId: string },
  GetQuizRequest,
  GetQuizResponse
> = async (req, res) => {
  if (!req.params.courseId) {
    return res.status(400).send({ error: "CourseId is required" });
  }

  if (!req.params.quizId) {
    return res.status(400).send({ error: "quizId is required" });
  }

  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }

  const existingUser = await db.getUserById(res.locals.userId);
  if (!existingUser) {
    return res.status(404).send({ error: "User is not found" });
  }

  const existingEnrollment = await db.checkEnrollment(
    existingUser.id,
    req.params.courseId
  );

  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }

  const quiz1 = await db.getQuizById(req.params.quizId);
  if (!quiz1) {
    return res.status(404).send({ error: "Quiz not found" });
  }

  if (!quiz1.isActive) {
    return res.status(403).send({ error: "Quiz isn't active" });
  }

  if (await db.getStudentById(existingUser.id)) {
    const grade = await db.getGrades(existingUser.id, req.params.quizId);
    if (grade) {
      return res
        .status(403)
        .send({ error: "Student has taken this quiz before" });
    }
  }

  const questions = await db.getQuizQuestionsByQuizId(req.params.quizId);
  if (!questions) {
    return res.status(404).send({ error: "Quiz Questions not found" });
  }

  return res.send({
    quiz: quiz1,
    questions: questions,
  });
};
