import { Router } from "express";
import student from "./student";
import college from "./college";

const router = Router();

router.use("/student", student);
router.use("/college", college);

export default router;
