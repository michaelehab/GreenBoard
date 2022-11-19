import { Router, Request, Response } from "express";
import { SignUpUser } from "../handlers/authHandler";
const router = Router();

router.get("/", SignUpUser);

export default router;
