import { Box, Flex, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router";
import { isLoggedInUser } from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import {
  GetCourseDataRequest,
  GetCourseDataResponse,
  ListCoursePostsRequest,
  ListCoursePostsResponse,
} from "@greenboard/shared";
import { ApiError } from "../utils/apiError";
import { PostCard } from "../components/postCard";

export const ViewCoursePosts = () => {
  const { courseId } = useParams();

  const { data: coursePosts } = useQuery([`view${courseId}CoursePosts`], () =>
    callEndpoint<ListCoursePostsRequest, ListCoursePostsResponse>(
      `/courses/${courseId}/posts`,
      "GET",
      true
    )
  );

  if (!courseId || !coursePosts) {
    <p>Not Found</p>;
  }

  return (
    <Center>
      <Box>
        <Flex direction="column">
          {!!coursePosts?.posts && coursePosts.posts.length > 0 ? (
            coursePosts?.posts.map((post, i) => <PostCard key={i} {...post} />)
          ) : (
            <p>No Posts right now</p>
          )}
        </Flex>
      </Box>
    </Center>
  );
};
