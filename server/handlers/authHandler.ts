import { ExpressHandler } from "../types";
import { UserSignUpRequest, UserSignUpResponse } from "@greenboard/shared";
export const SignUpUser: ExpressHandler<
  UserSignUpRequest,
  UserSignUpResponse
> = (req, res) => {
  res.sendStatus(200);
};
