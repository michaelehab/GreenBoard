import { Router } from "express";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
// router.post("/", CreateStudentQuestion);
// router.get("/", ListStudentQuestions);
// router.get("/:id", GetStudentQuestions);

export default router;
