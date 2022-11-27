import { useMutation } from "@apollo/client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { createPostMutation, postsQuery } from "../utils/grahql";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function PostInput({ user }) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      body: "",
      file: "",
    },
  });

  const navigate = useNavigate();

  const [createPost] = useMutation(createPostMutation, {
    // refetchQueries: ["POSTS"],
    update(cache, { data }) {
      const newPost = data?.createPost;
      const existingPosts = cache.readQuery({
        query: postsQuery,
      });
      if (existingPosts && newPost) {
        cache.writeQuery({
          query: postsQuery,
          data: {
            posts: [newPost, ...existingPosts.posts],
          },
        });
      }
    },
    optimisticResponse: {
      createPost: {
        __typename: "Post",
        id: "temp_id",
        // FIXME problem with the title and body values
        title: getValues("title"),
        body: getValues("body"),
        user: user.id,
        name: user.name,
        comments: [],
        likes: [],
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        image: {
          public_id: "temp",
          secure_url:
            "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
        },
      },
    },
  });
  const onSubmit = async (data) => {
    if (!user) return navigate("/login");
    await createPost({
      variables: {
        // post: data,
        post: {
          ...data,
          // FIXME set value in react hook form
          file: data.file[0],
        },
      },
    });
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          {...register("title")}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="body">
        <Form.Label>Body</Form.Label>
        <Form.Control type="text" placeholder="Body" {...register("body")} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="file">
        <Form.Label>Post Image</Form.Label>
        <Form.Control type="file" placeholder="Body" {...register("file")} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add post
      </Button>
    </Form>
  );
}

export default PostInput;
