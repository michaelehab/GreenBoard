import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { CollegeSignIn } from "../components/collegeSignIn";
import { SchoolSignIn } from "../components/schoolSignIn";
import { useTitle } from "../utils/useTitle";
import { DepartmentSignIn } from "../components/departmentSignIn";
import { StudentSignIn } from "../components/studentSignIn";
import { InstructorSignIn } from "../components/instructorSignIn";

export const SignIn = () => {
  useTitle("Sign in");

  return (
    <Tabs align="center">
      <TabList>
        <Tab>College</Tab>
        <Tab>School</Tab>
        <Tab>Department</Tab>
        <Tab>Instructor</Tab>
        <Tab>Student</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <CollegeSignIn />
        </TabPanel>
        <TabPanel>
          <SchoolSignIn />
        </TabPanel>
        <TabPanel>
          <DepartmentSignIn />
        </TabPanel>
        <TabPanel>
          <InstructorSignIn/>
        </TabPanel>
        <TabPanel>
          <StudentSignIn/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
