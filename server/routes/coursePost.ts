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
import post_comment from "./post_comment";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.use(post_comment);
router.post("/:courseId/posts", CreateCoursePost);
router.get("/:courseId/posts", ListCoursePosts);
router.get("/:courseId/posts/:postId", GetCoursePost);

export default router;
