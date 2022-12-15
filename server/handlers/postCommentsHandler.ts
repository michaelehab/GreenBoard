import { ExpressHandlerWithParams } from "../types";
import {
  CreateCommentRequest,
  CreatePostCommentResponse,
  ListPostCommentRequest,
  ListPostCommentResponse,
  GetPostCommentsRequest,
  GetPostCommentsResponse,
  PostComment,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";

export const ListPostComments: ExpressHandlerWithParams<
  { postId: string; courseId: string },
  ListPostCommentRequest,
  ListPostCommentResponse
> = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send({ error: "postId is required" });
  }

  if (!req.params.courseId) {
    console.log("Missing CourseId!");
    return res.status(400).send({ error: "CourseId is required" });
  }
  // Checking Valid Course
  const existingPost = await db.getCoursePostById(req.params.postId);
  if (!existingPost) {
    return res.status(404).send({ error: "Post not found" });
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
  return res.send({
    postComment: await db.listPostCommentsByPostId(req.params.postId),
  });
};

export const CreatePostComment: ExpressHandlerWithParams<
  { courseId: string; postId: string },
  CreateCommentRequest,
  CreatePostCommentResponse
> = async (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).send({ error: "All fields are required" });
  }

  if (!req.params.courseId) {
    console.log("Missing CourseId!");
    return res.status(400).send({ error: "CourseId is required" });
  }

  if (!req.params.postId) {
    console.log("Missing PostId!");
    return res.status(400).send({ error: "PostId is required" });
  }

  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }

  const existingPost = await db.getCoursePostById(req.params.postId);
  if (!existingPost) {
    return res.status(404).send({ error: "Post not found" });
  }

  const existingUser = await db.getUserById(res.locals.userId);
  if (!existingUser) {
    return res.status(403).send({ error: "user is not valid" });
  }

  const existingEnrollment = await db.checkEnrollment(
    existingUser.id,
    req.params.courseId
  );

  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }

  const postComment: PostComment = {
    id: crypto.randomBytes(20).toString("hex"),
    comment,
    postedAt: Date.now(),
    userId: res.locals.userId,
    postId: req.params.postId,
  };

  await db.createPostComment(postComment);

  return res.status(200).send({
    postComment: {
      id: postComment.id,
      comment: postComment.comment,
      postedAt: postComment.postedAt,
      postId: postComment.postId,
      userId: postComment.userId,
    },
  });
};

export const GetPostComment: ExpressHandlerWithParams<
  { courseId: string; postId: string; commentId: string },
  GetPostCommentsRequest,
  GetPostCommentsResponse
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
  const existingPost = await db.getCoursePostById(req.params.postId);
  if (!existingPost) {
    return res.status(404).send({ error: "Post not found" });
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

  const comment = await db.getPostCommentById(req.params.commentId);
  if (!comment) {
    return res.sendStatus(404);
  }

  return res.send({ postComment: comment });
};
