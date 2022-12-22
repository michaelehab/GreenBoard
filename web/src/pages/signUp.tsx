import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { CollegeSignUp } from "../components/collegeSignUp";
import { useTitle } from "../utils/useTitle";

export const SignUp = () => {
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
          <CollegeSignUp />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
