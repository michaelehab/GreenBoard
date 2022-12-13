import { ExpressHandlerWithParams } from "../types";
import {
  CreatePostRequest,
  CreateCoursePostResponse,
  ListCoursePostsRequest,
  ListCoursePostsResponse,
  GetCoursePostRequest,
  GetCoursePostResponse,
  CoursePost,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { validateUrl } from "../utils";

export const ListCoursePosts: ExpressHandlerWithParams<
  { courseId: string },
  ListCoursePostsRequest,
  ListCoursePostsResponse
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
    posts: await db.listCoursePostsByCourseId(req.params.courseId),
  });
};

export const CreateCoursePost: ExpressHandlerWithParams<
  { courseId: string },
  CreatePostRequest,
  CreateCoursePostResponse
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

  const coursePost: CoursePost = {
    id: crypto.randomBytes(20).toString("hex"),
    title,
    content,
    url,
    postedAt: Date.now(),
    courseId: req.params.courseId,
  };

  await db.createCoursePost(coursePost);

  return res.status(200).send({
    post: {
      id: coursePost.id,
      title: coursePost.title,
      url: coursePost.url,
      content: coursePost.content,
      postedAt: coursePost.postedAt,
      courseId: coursePost.courseId,
    },
  });
};

export const GetCoursePost: ExpressHandlerWithParams<
  { courseId: string; postId: string },
  GetCoursePostRequest,
  GetCoursePostResponse
> = async (req, res) => {
  if (!req.params.postId) {
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

  const post = await db.getCoursePostById(req.params.postId);
  if (!post) {
    return res.sendStatus(404);
  }

  return res.send({ post: post });
};
