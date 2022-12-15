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
router.post("/:courseId/post", CreateCoursePost);
router.get("/:courseId/post", ListCoursePosts);
router.get("/:courseId/post/:postId", GetCoursePost);

export default router;
