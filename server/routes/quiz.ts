import { Router } from "express";
import { CreateQuiz, getQuiz } from "../handlers/quizHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
import {
  GetQuizGrades,
  GetStudentGrade,
  ListCourseGrades,
  SubmitQuiz,
} from "../handlers/gradeHandler";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/:courseId/quizzes", CreateQuiz);
router.get("/:courseId/quizzes/:quizId", getQuiz);
router.post("/:courseId/quizzes/:quizId", SubmitQuiz);
router.get("/:courseId/grades", ListCourseGrades);
router.get("/:courseId/quizzes/:quizId/grades", GetQuizGrades);
router.get(
  "/:courseId/quizzes/:quizId/students/:studentId/grades",
  GetStudentGrade
);

export default router;
