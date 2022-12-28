import { Router } from "express";
import {
  SignUpStudent,
  SignInStudent,
  UpdateStudent,
  GetStudentById,
} from "../handlers/studentHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
const router = Router();

router.post("/signup", SignUpStudent);
router.post("/signin", SignInStudent);
router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.put("/update", UpdateStudent);
router.get("/:studentId", GetStudentById);

export default router;
