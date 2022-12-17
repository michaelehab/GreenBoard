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
  const existingPost = await db.getstuQuestionById(req.params.questionId);
  if (!existingPost) {
    return res.status(404).send({ error: "question not found" });
  }
  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "course not found" });
  }

  const existingInstructor = await db.getUserById(res.locals.userId);
  if (!existingInstructor) {
    return res.status(404).send({ error: "User is not found" });
  }
  const existingEnrollment = await db.checkEnrollment(
    existingInstructor.id,
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

  const existingInstructor = await db.getInstructorById(
    res.locals.instructorId
  );
  if (!existingInstructor) {
    return res.status(403).send({ error: "Instructor is not valid" });
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

  const existingstudentQuestion = await db.getstuQuestionById(
    req.params.questionId
  );
  if (!existingstudentQuestion) {
    return res.status(404).send({ error: "Question not found" });
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
    instructorId: res.locals.instructorId,
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
  { courseId: string; questionId: string; AnswerId: string },
  GetInstructorAnswerRequest,
  GetInstructorAnswerResponse
> = async (req, res) => {
  if (!req.params.questionId) {
    return res.status(400).send({ error: "questionId is required" });
  }

  if (!req.params.courseId) {
    return res.status(400).send({ error: "CourseId is required" });
  }
  const existingInstructor = await db.getInstructorById(
    res.locals.instructorId
  );
  if (!existingInstructor) {
    return res.status(404).send({ error: "instructor is not found" });
  }

  if (!req.params.AnswerId) {
    return res.status(400).send({ error: "insructorAnswerid is required" });
  }
  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }
  const existingstudentQuestion = await db.getstuQuestionById(
    req.params.questionId
  );
  if (!existingstudentQuestion) {
    return res.status(404).send({ error: "Question not found" });
  }

  const existingEnrollment = await db.checkEnrollment(
    existingInstructor.id,
    req.params.courseId
  );

  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }

  const comment = await db.getInstructorAnsweById(req.params.AnswerId);
  if (!comment) {
    return res.sendStatus(404);
  }

  return res.send({ instructorAnswer: comment });
};