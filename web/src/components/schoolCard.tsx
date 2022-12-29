import {
  Text,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Heading,
} from "@chakra-ui/react";
import { SchoolData } from "@greenboard/shared";
import { Link } from "react-router-dom";

export const SchoolCard: React.FC<SchoolData> = (school) => {
  return (
    <Card w={500}>
      <Link to={`/schools/${school.id}`}>
        <CardHeader>
          <Heading size="md">{school.name}</Heading>
        </CardHeader>
      </Link>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Text>email: {school.email}</Text>
          <Text>Phone Number: {school.phone}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
};
