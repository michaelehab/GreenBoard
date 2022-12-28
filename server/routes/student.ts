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
import { ChangeUserPassword } from "../handlers/userHandler";
const router = Router();

router.post("/signup", SignUpStudent);
router.post("/signin", SignInStudent);
router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.put("/update", UpdateStudent);
router.get("/:studentId", GetStudentById);
router.put("/password", ChangeUserPassword);

export default router;
