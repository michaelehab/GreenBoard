import { Router } from "express";
import { SignUpStudent, SignInStudent } from "../handlers/studentHandler";
const router = Router();

router.post("/signup", SignUpStudent);
router.post("/signin", SignInStudent);

export default router;
