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
  { postId: string; courseId: string },
  ListInstructorsAnswersRequest,
  ListInstructorsAnswersResponse
> = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send({ error: "postId is required" });
  }
  if (!req.params.courseId) {
    console.log("Missing stdudentQuestionId!");
    return res.status(400).send({ error: "stdudentQuestionId is required" });
  }
  const existingPost = await db.getstuQuestionById(req.params.postId);
  if (!existingPost) {
    return res.status(404).send({ error: "Post not found" });
  }
  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "stdudentQuestion not found" });
  }

  const existingUser = await db.getInstructorById(res.locals.instructorId);
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
    instructorAnswer: await db.listInstructorAnswerByPostId(req.params.postId),
  });
};
export const createInstructorAnswer: ExpressHandlerWithParams<
  { courseId: string; postId: string },
  CreateCommentRequest,
  CreateInstructorAnswerResponse
> = async (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingInstructor = await db.getInstructorById(res.locals.userId);
  if (!existingInstructor) {
    return res.status(403).send({ error: "Instructor is not valid" });
  }

  //if (!req.params.courseId) {
  //console.log("Missing CourseId!");
  //return res.status(400).send({ error: "CourseId is required" });
  //}

  //if (!req.params.postId) {
  //console.log("Missing PostId!");
  //return res.status(400).send({ error: "PostId is required" });
  //}

  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }

  const existingstudentQuestion = await db.getstuQuestionById(
    req.params.postId
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
    questionId: req.params.postId,
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
  { courseId: string; postId: string; commentId: string },
  GetInstructorAnswerRequest,
  GetInstructorAnswerResponse
> = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send({ error: "PostId is required" });
  }

  if (!req.params.courseId) {
    return res.status(400).send({ error: "CourseId is required" });
  }

  if (!req.params.commentId) {
    return res.status(400).send({ error: "CommentId is required" });
  }
  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }
  const existingstudentQuestion = await db.getstuQuestionById(
    req.params.postId
  );
  if (!existingstudentQuestion) {
    return res.status(404).send({ error: "Question not found" });
  }

  const existingUser = await db.getInstructorById(res.locals.instructorId);
  if (!existingUser) {
    return res.status(404).send({ error: "instructor is not found" });
  }

  const existingEnrollment = await db.checkEnrollment(
    existingUser.id,
    req.params.courseId
  );

  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }

  const comment = await db.getInstructorAnsweById(req.params.commentId);
  if (!comment) {
    return res.sendStatus(404);
  }

  return res.send({ instructorAnswer: comment });
};
