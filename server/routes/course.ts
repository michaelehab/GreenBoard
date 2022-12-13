import { Router } from "express";
import { CreateCourse, JoinCourse } from "../handlers/courseHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
import coursePost from "./coursePost";
import studentQuestion from "./studentQuestion";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/", CreateCourse);
router.post("/join", JoinCourse);

router.use(coursePost);
router.use("/:courseId/question", studentQuestion);

export default router;
