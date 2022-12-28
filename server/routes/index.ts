import { Router } from "express";
import student from "./student";
import college from "./college";
import school from "./school";
import instructor from "./instructor";
import department from "./department";
import course from "./course";
import announcements from "./announcements";
import user from "./user";

const router = Router();

router.use("/students", student);
router.use("/colleges", college);
router.use("/schools", school);
router.use("/departments", department);
router.use("/instructors", instructor);
router.use("/courses", course);
router.use("/announcements", announcements);
router.use("/users", user);

export default router;
