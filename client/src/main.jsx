import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { AuthProvider } from "./context/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const uri = import.meta.env.PROD
  ? "https://apollo-merng.herokuapp.com/"
  : "http://localhost:3001";

// const httpLink = createHttpLink({
//   uri,
// });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = ApolloLink.from([
  authLink,
  createUploadLink({
    uri: "https://apollo-merng.herokuapp.com/",
    // uri,
    headers: {
      // "Access-Control-Allow-Origin": "*",
      "Apollo-Require-Preflight": "true",
    },
    // fetchOptions: {
    //   mode: "no-cors",
    // },
  }),
  // httpLink,
]);

const client = new ApolloClient({
  // link: authLink.concat(link),
  link,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
