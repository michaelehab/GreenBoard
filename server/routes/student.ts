import { Router } from "express";
import { SignUpUser } from "../handlers/authHandler";
const router = Router();

router.post("/signup", SignUpUser);
router.post("/signin", SignUpUser);

export default router;
