import { useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";
import { AuthContext } from "../context/auth";
import { loginMutation } from "../utils/grahql";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(4).required(),
  })
  .required();

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(loginMutation, {
    update(_, { data: { loginUser } }) {
      authContext.loginOrRegister(loginUser);
      navigate("/");
    },
    onError(err) {
      const graphqlError = err.graphQLErrors[0];
      setError(graphqlError.extensions.argumentName, {
        type: "customType",
        message: graphqlError.message,
      });
    },
  });

  const onSubmit = async (data) => {
    await login({
      variables: data,
    });
  };

  return (
    <div className="w-50 mx-auto mt-{150px}">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          // width: "400px",
          marginTop: "150px",
        }}
      >
        <Form.Group controlId="email" className="my-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="Email"
            {...register("email")}
            isInvalid={!!errors.email}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password")}
            isInvalid={!!errors.password}
          />
        </Form.Group>
        <Button type="submit" disabled={loading} className="my-3">
          {loading ? "Loading..." : "Login"}
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <Alert variant="danger">
          <ul className="mb-0">
            {Object.values(errors).map((input, i) => (
              <li key={i}>{input.message}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
};

export default Login;
