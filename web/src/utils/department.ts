import {
  DepartmentUpdateRequest,
  DepartmentUpdateResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function updateDepartment(name: string, email: string) {
  await callEndpoint<DepartmentUpdateRequest, DepartmentUpdateResponse>(
    `/department/update`,
    "PUT",
    false,
    {
      name,
      email,
    }
  );
}
