import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { SchoolSignUp } from "../components/schoolSignUp";

import { useTitle } from "../utils/useTitle";

export const SignUp = () => {
  useTitle("Sign Up");

  return (
    <Tabs>
      <TabList>
        <Tab>College</Tab>
        <Tab>School</Tab>
        <Tab>Department</Tab>
        <Tab>Instructor</Tab>
        <Tab>Student</Tab>
      </TabList>

      <TabPanels>
        <TabPanel></TabPanel>

        <TabPanel>
          <SchoolSignUp />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
