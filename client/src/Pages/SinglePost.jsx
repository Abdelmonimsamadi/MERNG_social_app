import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useState } from "react";
import { useContext } from "react";
import { Badge, Button, Card, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import {
  addCommentMutation,
  deletePostMutation,
  likeMutation,
  postQuery,
  postsQuery,
} from "../utils/grahql";
import { AuthContext } from "../context/auth";
import { useForm } from "react-hook-form";

const SinglePost = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const [input, setInput] = useState("");
  const params = useParams();
  const id = params?.id;

  const { data } = useQuery(postQuery, {
    variables: { postId: id },
  });
  const post = data?.post;
  const [addComment] = useMutation(addCommentMutation, {
    refetchQueries: ["POST"],
    // update(cache, { data: { addComment } }) {
    //   const existingPost = cache.readQuery({
    //     query: postQuery,
    //     variables: { postId: id },
    //   });
    //   cache.writeQuery({
    //     query: postQuery,
    //     data: {
    //       post: {
    //         ...existingPost,
    //         comments: addComment,
    //       },
    //     },
    //   });
    // },
  });

  if (post) {
    const isLiked = post.likes.find((id) => id === context.user?.id);
    var predictedLikes = isLiked
      ? post.likes.filter((id) => id !== context.user?.id)
      : [...post.likes, context.user?.id];
  }
  const [like] = useMutation(likeMutation, {
    optimisticResponse: {
      likePost: {
        ...post,
        likes: predictedLikes,
      },
    },
  });
  const [deletePost] = useMutation(deletePostMutation, {
    variables: { deletePostId: post?.id },
    update(cache) {
      const existingPosts = cache.readQuery({
        query: postsQuery,
      }).posts;
      cache.writeQuery({
        query: postsQuery,
        data: {
          posts: existingPosts.filter((item) => item.id !== post?.id),
        },
      });
    },
    optimisticResponse: {
      deletePost: {
        ...post,
      },
    },
  });
  const handleClickDelete = () => {
    if (!context.user) return navigate("login");
    deletePost();
    navigate("/");
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { body: "" } });

  const onSubmit = (data) => {
    if (!context.user) return navigate("login");
    addComment({
      variables: { postId: id, body: data.commentInput },
      // optimisticResponse: {
      //   addComment: [
      //     {
      //       __typename: "Comment",
      //       id: new Date().getTime(),
      //       userId: context.user?.id,
      //       username: context.user?.name,
      //       body: getValues("commentInput"),
      //       createdAt: new Date().toISOString(),
      //     },
      //     ...post.comments,
      //   ],
      // },
    });
    setInput("");
  };

  const isPostOwner = context?.user?.id === post?.user;

  const dateToNumber = (date) => new Date(date).getTime();

  // FIXME get sorted comment from database directly & refactor comments query
  const sortComments = (array) => {
    return array.sort((x, y) => {
      x = dateToNumber(x.createdAt);
      y = dateToNumber(y.createdAt);
      return y - x;
    });
  };
  const sortedComments = post?.comments && sortComments([...post.comments]);
  return (
    post && (
      <>
        <Card>
          <Card.Img
            variant="top"
            src={post.image.secure_url}
            style={{
              objectFit: "cover",
              aspectRatio: "2/1",
            }}
          />
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {moment(Number(post.createdAt)).fromNow()}
            </Card.Subtitle>
            <Card.Text>{post.body}</Card.Text>
            <Stack direction="horizontal" className="gap-1">
              <Button
                onClick={() => {
                  if (!context.user) return navigate("login");
                  like({
                    variables: { id: post.id },
                  });
                }}
                variant="dark"
              >
                Like <Badge bg="secondary">{post.likes.length}</Badge>
              </Button>
              {isPostOwner && (
                <Button variant="danger" onClick={handleClickDelete}>
                  Delete
                </Button>
              )}
            </Stack>
          </Card.Body>
        </Card>
        <h3 className="my-3">Comments</h3>
        {/* {context.user ? (
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group controlId="comment">
              <Form.Label>Add comment</Form.Label>
              <Form.Control
                type="text"
                onChange={handleChange}
                value={input}
                required
              />
              <Form.Control.Feedback type="invalid">
                Comment must not be empty.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        ) : (
          <div className="my-4">Login to write comment !</div>
        )} */}

        {/* {post.comments.length === 0 ? (
          <div>No comments</div>
        ) : (
          sortedComments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        )} */}

        <section>
          <div>
            <div className="row d-flex justify-content-center">
              <div className="col-md-12 col-lg-10 col-xl-8">
                <div className="vstack gap-2">
                  {sortedComments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                  <div className="card">
                    {/* <div className="card-body"> */}
                    {context.user && (
                      <form
                        className="card-footer py-3 border-0"
                        // style={{ backgroundColor: "#f8f9fa" }}
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <div className="d-flex flex-start w-100">
                          <img
                            className="rounded-circle shadow-1-strong me-3"
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                            alt="avatar"
                            width="40"
                            height="40"
                          />
                          <div className="form-outline w-100">
                            <textarea
                              className="form-control"
                              id="textAreaExample"
                              rows="4"
                              style={{ background: "#fff" }}
                              {...register("commentInput")}
                            ></textarea>
                            <label
                              className="form-label"
                              htmlFor="textAreaExample"
                            >
                              Write your comment
                            </label>
                          </div>
                        </div>
                        <div className="float-end mt-2 pt-1">
                          <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                          >
                            Post comment
                          </button>
                          {/* <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Cancel
                        </button> */}
                        </div>
                      </form>
                    )}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  );
};

export default SinglePost;
