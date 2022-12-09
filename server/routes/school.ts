import { Router } from "express";
import { SignUpSchool, SignInSchool } from "../handlers/schoolHandler";
const router = Router();

router.post("/signup", SignUpSchool);
router.post("/signin", SignInSchool);

export default router;
