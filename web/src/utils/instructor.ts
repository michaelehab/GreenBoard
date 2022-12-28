import {
  InstructorUpdateRequest,
  InstructorUpdateResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function updateInstructor(
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string
) {
  await callEndpoint<InstructorUpdateRequest, InstructorUpdateResponse>(
    `/instructor/update`,
    "PUT",
    false,
    {
      firstName,
      lastName,
      phoneNumber,
      email,
    }
  );
}
