import {
  StudentUpdateRequest,
  StudentUpdateResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function updateStudent(
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string
) {
  await callEndpoint<StudentUpdateRequest, StudentUpdateResponse>(
    `/students/update`,
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
