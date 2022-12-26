import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Input,
  Center,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { isLoggedIn, isLoggedInUser } from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import { CommentCard } from "../components/commentCard";
import { NotFound } from "./notFound";
import {
  CreateCommentRequest,
  CreatePostCommentResponse,
  GetCoursePostRequest,
  GetCoursePostResponse,
  ListPostCommentRequest,
  ListPostCommentResponse,
} from "@greenboard/shared";

export const ViewCoursePost = () => {
  const { courseId, postId } = useParams();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedInUser()) {
      navigate("/");
    }
  }, [navigate]);

  const { data: postData } = useQuery([`view${postId}post`], () =>
    callEndpoint<GetCoursePostRequest, GetCoursePostResponse>(
      `/courses/${courseId}/posts/${postId}`,
      "GET",
      true
    )
  );

  const { data: commentsData, refetch: refetchComments } = useQuery(
    [`list${postId}comments`],
    () =>
      callEndpoint<ListPostCommentRequest, ListPostCommentResponse>(
        `/courses/${courseId}/posts/${postId}/comments`,
        "GET",
        true
      )
  );

  const addComment = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (comment === "") {
        setError("Comment can't be empty");
      } else {
        await callEndpoint<CreateCommentRequest, CreatePostCommentResponse>(
          `/courses/${courseId}/posts/${postId}/comments`,
          "POST",
          true,
          {
            comment,
          }
        );
        setComment("");
        refetchComments();
      }
    },
    [comment, refetchComments, courseId, postId]
  );

  if (!courseId || !postData || !postId) {
    return <NotFound />;
  }

  return (
    <Center flexDirection="column">
      <Flex align="center" flexDirection="column">
        <Box
          maxW="6xl"
          w={["sm", "xl", "3xl"]}
          m={5}
          boxShadow="xl"
          p="6"
          rounded="md"
          bg="white"
        >
          <Text fontSize="md" fontWeight="bold">
            {postData.post.firstName} {postData.post.lastName}
          </Text>
          <Text fontSize="md" fontWeight="bold">
            {postData.post.title}
          </Text>
          <Text fontSize="md">{postData.post.content}</Text>
          <ChakraLink href={postData.post.url}>Link</ChakraLink>
        </Box>
      </Flex>
      <Flex direction="column">
        {!!commentsData && commentsData.postComment.length > 0 ? (
          commentsData.postComment.map((c, i) => <CommentCard key={i} {...c} />)
        ) : (
          <Center>No comments on this post</Center>
        )}
      </Flex>
      {isLoggedIn() && (
        <Box>
          <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
            <Input
              placeholder="Enter Your Comment"
              value={comment}
              variant="outline"
              onChange={(e) => setComment(e.target.value)}
            />

            <Box m="auto">
              <Button
                colorScheme="green"
                variant="solid"
                type="submit"
                display="block"
                onClick={addComment}
              >
                Add Comment
              </Button>
            </Box>

            {!!error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </Flex>
        </Box>
      )}
    </Center>
  );
};
