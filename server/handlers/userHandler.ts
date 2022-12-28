import {
  UserChangePasswordRequest,
  UserChangePasswordResponse,
} from "@greenboard/shared";
import { ExpressHandler } from "../types";
import { db } from "../datastore";
import { getPasswordHashed } from "../utils";

export const ChangeUserPassword: ExpressHandler<
  UserChangePasswordRequest,
  UserChangePasswordResponse
> = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log("lol");

  if (
    !newPassword ||
    !oldPassword ||
    newPassword === "" ||
    oldPassword === ""
  ) {
    return res.status(400).send({ error: "At least one field is required" });
  }

  const existingUser = await db.getUserById(res.locals.userId);
  if (!existingUser) {
    return res.status(404).send({ error: "Student not found" });
  }

  if (getPasswordHashed(oldPassword) !== existingUser.password) {
    return res.status(400).send({ error: "Old Password is not correct" });
  }

  await db.changeUserPassword(existingUser.id, getPasswordHashed(newPassword));

  return res.sendStatus(200);
};
