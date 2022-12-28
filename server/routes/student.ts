import { Router } from "express";
import {
  SignUpStudent,
  SignInStudent,
  UpdateStudent,
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

export default router;
