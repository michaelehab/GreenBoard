import { ExpressHandler } from "../types";
import {
  StudentSignUpRequest,
  StudentSignUpResponse,
} from "@greenboard/shared";
export const SignUpUser: ExpressHandler<
  StudentSignUpRequest,
  StudentSignUpResponse
> = (req, res) => {
  res.sendStatus(200);
};
