import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { CollegeSignUp } from "../components/collegeSignUp";
import { DepartmentSignUp } from "../components/departmentSignUp";
import { SchoolSignUp } from "../components/schoolSignUp";
import { useTitle } from "../utils/useTitle";

export const SignUp = () => {
  useTitle("Sign in");

  return (
    <Tabs align="center" colorScheme="green">
      <TabList>
        <Tab>College</Tab>
        <Tab>School</Tab>
        <Tab>Department</Tab>
        <Tab>Instructor</Tab>
        <Tab>Student</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <CollegeSignUp />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
