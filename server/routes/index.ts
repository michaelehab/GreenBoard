import { Router } from "express";
import student from "./student";
import college from "./college";
import school from "./school";
import department from "./department"

const router = Router();

router.use("/student", student);
router.use("/college", college);
router.use("/school", school);
router.use("/department",department);

export default router;
