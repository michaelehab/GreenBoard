import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Input,
  Center,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { isLoggedIn, isLoggedInUser } from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import { CommentCard } from "../components/commentCard";
import { PostCard } from "../components/postCard";
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
    <Center>
      <Box>
        <Flex align="center">
          <PostCard {...postData?.post!} />
        </Flex>
        <Flex direction="column">
          {!!commentsData && commentsData.postComment.length > 0 ? (
            commentsData.postComment.map((c, i) => (
              <CommentCard key={i} {...c} />
            ))
          ) : (
            <Center>No comments on this post</Center>
          )}
        </Flex>
        {isLoggedIn() && (
          <form onSubmit={addComment}>
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
          </form>
        )}
      </Box>
    </Center>
  );
};
