import { Router } from "express";
import {
  CreateQuiz,
  getQuiz,
  toggleQuizActivation,
} from "../handlers/quizHandler";
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
router.post("/:courseId/quiz", CreateQuiz);
router.get("/:courseId/quiz/:quizId", getQuiz);
router.post("/:courseId/quiz/:quizId", SubmitQuiz);
router.get("/:courseId/grades", ListCourseGrades);
router.get("/:courseId/quiz/:quizId/grades", GetQuizGrades);
router.get(
  "/:courseId/quiz/:quizId/student/:studentId/grades",
  GetStudentGrade
);
router.put("/:courseId/quiz/:quizId/toggle", toggleQuizActivation);

export default router;
