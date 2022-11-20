import { Router } from "express";
import auth from "./auth";
import college from "./college";

const router = Router();

router.use("/auth", auth);
router.use("/college", college);

export default router;
