import { ExpressHandlerWithParams } from "../types";
import {
  CreateCommentRequest,
  CreateInstructorAnswerResponse,
  ListInstructorsAnswersRequest,
  ListInstructorsAnswersResponse,
  GetInstructorAnswerRequest,
  GetInstructorAnswerResponse,
  InstructorAnswer,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";

export const ListInstructorAnswer: ExpressHandlerWithParams<
  { courseId: string; questionId: string },
  ListInstructorsAnswersRequest,
  ListInstructorsAnswersResponse
> = async (req, res) => {
  if (!req.params.questionId) {
    return res.status(400).send({ error: "questionId is required" });
  }
  if (!req.params.courseId) {
    console.log("Missing courseId!");
    return res.status(400).send({ error: "courseId is required" });
  }
  const existingPost = await db.getStdQuestionById(req.params.questionId);
  if (!existingPost) {
    return res.status(404).send({ error: "question not found" });
  }
  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "course not found" });
  }

  const existingUserId = await db.getUserById(res.locals.userId);
  if (!existingUserId) {
    return res.status(404).send({ error: "User is not found" });
  }
  const existingEnrollment = await db.checkEnrollment(
    existingUserId.id,
    req.params.courseId
  );
  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }
  return res.send({
    instructorAnswer: await db.listInstructorAnswerByPostId(
      req.params.questionId
    ),
  });
};
export const createInstructorAnswer: ExpressHandlerWithParams<
  { courseId: string; questionId: string },
  CreateCommentRequest,
  CreateInstructorAnswerResponse
> = async (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).send({ error: "All fields are required" });
  }

  if (!req.params.courseId) {
    console.log("Missing CourseId!");
    return res.status(400).send({ error: "CourseId is required" });
  }

  if (!req.params.questionId) {
    console.log("Missing questionId!");
    return res.status(400).send({ error: "questionId is required" });
  }

  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }

  const existingstudentQuestion = await db.getStdQuestionById(
    req.params.questionId
  );
  if (!existingstudentQuestion) {
    return res.status(404).send({ error: "Question not found" });
  }
  const existingInstructor = await db.getInstructorById(res.locals.userId);
  if (!existingInstructor) {
    return res.status(403).send({ error: "Instructor is not found" });
  }

  const existingEnrollment = await db.checkEnrollment(
    existingInstructor.id,
    req.params.courseId
  );

  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }
  const instructorAnswer: InstructorAnswer = {
    id: crypto.randomBytes(20).toString("hex"),
    comment,
    postedAt: Date.now(),
    instructorId: res.locals.userId,
    questionId: req.params.questionId,
  };
  await db.createInstructorAnswer(instructorAnswer);
  return res.status(200).send({
    instructorAnswer: {
      id: instructorAnswer.id,
      comment: instructorAnswer.comment,
      postedAt: instructorAnswer.postedAt,
      instructorId: instructorAnswer.instructorId,
      questionId: instructorAnswer.questionId,
    },
  });
};
export const getInstructorAnswer: ExpressHandlerWithParams<
  { courseId: string; questionId: string; answerId: string },
  GetInstructorAnswerRequest,
  GetInstructorAnswerResponse
> = async (req, res) => {
  if (!req.params.questionId) {
    return res.status(400).send({ error: "questionId is required" });
  }

  if (!req.params.courseId) {
    return res.status(400).send({ error: "CourseId is required" });
  }

  if (!req.params.answerId) {
    return res.status(400).send({ error: "insructorAnswerid is required" });
  }
  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }
  const existingstudentQuestion = await db.getStdQuestionById(
    req.params.questionId
  );
  if (!existingstudentQuestion) {
    return res.status(404).send({ error: "Question not found" });
  }
  const existingUser = await db.getUserById(res.locals.userId);
  if (!existingUser) {
    return res.status(404).send({ error: "user is not found" });
  }
  const existingEnrollment = await db.checkEnrollment(
    existingUser.id,
    req.params.courseId
  );

  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }

  const comment = await db.getInstructorAnswerById(req.params.answerId);
  if (!comment) {
    return res.sendStatus(404);
  }

  return res.send({ instructorAnswer: comment });
};
