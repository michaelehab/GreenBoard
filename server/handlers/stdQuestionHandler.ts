import { ExpressHandlerWithParams } from "../types";
import {
  CreateStudentQuestionResponse,
  CreatePostRequest,
  GetCourseStudentQuestionRequest,
  GetCourseStudentQuestionResponse,
  GetCourseStudentsQuestionsResponse,
  GetCourseStudentsQuestionsRequest,
  StudentQuestion,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { validateUrl } from "../utils";

export const ListStudentQuestions: ExpressHandlerWithParams<
  { courseId: string },
  GetCourseStudentsQuestionsRequest,
  GetCourseStudentsQuestionsResponse
> = async (req, res) => {
  if (!req.params.courseId) {
    return res.status(400).send({ error: "CourseId is required" });
  }
  // Checking Valid Course
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
  return res.send({
    questions: await db.listStuQuestionByCourseId(req.params.courseId),
  });
};

export const CreateStudentQuestion: ExpressHandlerWithParams<
  { courseId: string },
  CreatePostRequest,
  CreateStudentQuestionResponse
> = async (req, res) => {
  const { title, url, content } = req.body;
  if (!title || !url || !content) {
    return res.status(400).send({ error: "All fields are required" });
  }
  if (!validateUrl(url)) {
    return res.status(400).send({ error: "URL is not valid" });
  }
  if (!req.params.courseId) {
    console.log("Missing CourseId!");
    return res.status(400).send({ error: "CourseId is required" });
  }

  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }
  const existingStudent = await db.getStudentById(res.locals.userId);
  if (!existingStudent) {
    return res.status(403).send({ error: "Student is not valid" });
  }
  const existingEnrollment = await db.checkEnrollment(
    existingStudent.id,
    req.params.courseId
  );
  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }
  const question: StudentQuestion = {
    id: crypto.randomBytes(20).toString("hex"),
    title,
    content,
    url,
    postedAt: Date.now(),
    courseId: req.params.courseId,
    studentId:res.locals.userId
  };
  await db.createStuQuestion(question);
  return res.status(200).send({
    question: {
      id: question.id,
      title: question.title,
      url: question.url,
      content: question.content,
      postedAt: question.postedAt,
      courseId: question.courseId,
      studentId:res.locals.userId

    },
  });
};
export const GetStudentQuestion: ExpressHandlerWithParams<
  { courseId: string; studentQuestionId: string },
  GetCourseStudentQuestionRequest,
  GetCourseStudentQuestionResponse
> = async (req, res) => {
  if (!req.params.studentQuestionId) {
    return res.status(400).send({ error: "PostId is required" });
  }
  if (!req.params.courseId) {
    return res.status(400).send({ error: "CourseId is required" });
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
  const question = await db.getStdQuestionById(req.params.studentQuestionId);
  if (!question) {
    return res.sendStatus(404);
  }
  return res.send({ question: question });
};
