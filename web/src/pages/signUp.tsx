import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { CollegeSignUp } from "../components/collegeSignUp";
import { useTitle } from "../utils/useTitle";

export const SignUp = () => {
  useTitle("Sign in");

  return (
    <Tabs align="center" colorScheme="green">
      <TabList>
        <Tab>College</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <CollegeSignUp />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
