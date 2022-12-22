import { Router } from "express";
import {
  CreateCourse,
  JoinCourse,
  GetCourse,
  ListCourses,
  ListAvailableCourses,
} from "../handlers/courseHandler";
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
router.get("/available", ListAvailableCourses);
router.post("/join", JoinCourse);
router.get("/", ListCourses);
router.get("/:courseId", GetCourse);

router.use(coursePost);
router.use(studentQuestion);
router.use(quiz);

export default router;
