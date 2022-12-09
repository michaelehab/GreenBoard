import { Router } from "express";
import student from "./student";
import college from "./college";
import school from "./school";

const router = Router();

router.use("/student", student);
router.use("/college", college);
router.use("/school", school);

export default router;
