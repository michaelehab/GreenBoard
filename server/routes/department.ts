import { Router } from "express";
import { SignInDepartment,SignUpDepartment} from "../handlers/departmentHandler";
 
const router=Router();

router.post("/signup",SignUpDepartment);
router.post("/signin",SignInDepartment);

export default router;