import { useQuery } from "@tanstack/react-query";

import { callEndpoint } from "../utils/callEndpoint";
import { useTitle } from "../utils/useTitle";
import { Center, Text, Flex, Heading } from "@chakra-ui/react";
import { ListSchoolsRequest, ListSchoolsResponse } from "@greenboard/shared";
import { getLocalCollegeId, isLoggedInCollege } from "../utils/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SchoolCard } from "../components/schoolCard";

export const ListSchools = () => {
  useTitle("Schools");
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery(
    [`list${getLocalCollegeId()}Schools`],
    () =>
      callEndpoint<ListSchoolsRequest, ListSchoolsResponse>(
        "/colleges/schools",
        "GET",
        true
      )
  );

  useEffect(() => {
    if (!isLoggedInCollege()) {
      navigate("/");
    }
  }, [navigate, data]);

  if (isLoading) {
    return <div>Is Loading...</div>;
  }
  if (error) {
    return <div>Error loading Courses!</div>;
  }

  return (
    <Center flexDirection="column">
      <Center>
        <Heading color="#4d7e3e">My Schools</Heading>
      </Center>
      <Flex direction="column">
        {!!data?.schools && data.schools.length > 0 ? (
          data?.schools.map((school, i) => <SchoolCard key={i} {...school} />)
        ) : (
          <Text>No Schools right now</Text>
        )}
      </Flex>
    </Center>
  );
};
