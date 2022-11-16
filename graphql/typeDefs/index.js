const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    token: String!
  }
  type Comment{
    id: ID!
    userId: String!
    username: String!
    body: String!
    createdAt: String!
  }
  type Post{
    id: ID!
    title: String!
    body: String!
    user: String!
    name: String!
    comments: [Comment]
    likes: [String]
    createdAt: String!
    updatedAt: String!
  }
  input inputPost{
    title: String!
    body: String!
  }
  input inputUser {
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  type Query {
    users: [User]
    posts: [Post]
    post(id: ID!): Post
  }
  type Mutation {
    registerUser(user: inputUser): User!
    loginUser(email: String!,password: String!): User!
    updateUser(id: ID!, name: String!, password: String, email:String!): User!
    deleteUser(id: ID!): User!
    createPost(post: inputPost): Post!
    deletePost(id: ID!): Boolean!
    updatePost(id:ID!, post: inputPost): Post!
    likePost(id: ID!): Post
    addComment(postId:ID!,body: String!): [Comment]
  }
`;

export default typeDefs