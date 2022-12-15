import { Router } from "express";
import {
  CreateCoursePost,
  GetCoursePost,
  ListCoursePosts,
} from "../handlers/coursePostHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
import postComment from "./postComment";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/:courseId/post", CreateCoursePost);
router.get("/:courseId/post", ListCoursePosts);
router.use("/:courseId/post/:postId", postComment);
router.get("/:courseId/post/:postId", GetCoursePost);

export default router;
