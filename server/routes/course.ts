import { Router } from "express";
import { CreateCourse, JoinCourse, GetCourse } from "../handlers/courseHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
import coursePost from "./coursePost";
import studentQuestion from "./studentQuestion";
import quiz from "./quiz";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/", CreateCourse);
router.post("/join", JoinCourse);
router.get("/:courseId", GetCourse);

router.use(coursePost);
router.use(studentQuestion);
router.use(quiz);

export default router;
