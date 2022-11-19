import { gql } from "@apollo/client";

export const likeMutation = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      title
      body
      name
      comments {
        id
        userId
        username
        body
        createdAt
      }
      likes
      createdAt
      updatedAt
    }
  }
`

export const createPostMutation = gql`
mutation CreatePost($post: inputPost) {
  createPost(post: $post) {
    title
    body
    likes 
    comments {
      body
      createdAt
      id
      userId
      username
    }
    name
    user
    createdAt
    id
    updatedAt
  }
}
`

export const postsQuery = gql`
  query POSTS {
    posts {
      title
      body
      comments {
        body
        createdAt
        id
        userId
        username
      }
      likes
      user
      name
      updatedAt
      createdAt
      id
    }
  }
`

export const postQuery = gql`
  query POST($postId: ID!) {
  post(id: $postId) {
    id
    title
    body
    user
    name
    likes 
    createdAt
    updatedAt
    comments {
      id
      userId
      username
      body
      createdAt
    }
  }
}
`

export const deletePostMutation = gql`
mutation DeletePost($deletePostId: ID!) {
  deletePost(id: $deletePostId)
}
`

export const addCommentMutation = gql`
  mutation AddComment($postId: ID!, $body: String!) {
    addComment(postId: $postId, body: $body) {
      id
      userId
      username
      body
      createdAt
    }
  }
`;

export const registerMutation = gql`
  mutation RegisterUser($user: inputUser) {
    registerUser(user: $user) {
      name
      email
      createdAt
      updatedAt
      token
      id
    }
  }
`;

export const loginMutation = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      name
      email
      createdAt
      updatedAt
      token
      id
    }
  }
`;