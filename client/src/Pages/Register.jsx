import React, { useContext } from "react";
import { Button, Form,Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { registerMutation } from "../utils/grahql";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string().min(3).required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [registerUser, { loading }] = useMutation(registerMutation, {
    update(_, { data: { registerUser } }) {
      authContext.loginOrRegister(registerUser);
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

  const onsubmit = async (data) => {
    await registerUser({ variables: { user: data } });
  };

  return (
    <div className="w-50 mx-auto mt-{150px}">
      <Form
        onSubmit={handleSubmit(onsubmit)}
        style={{
          // width: "400px",
          marginTop: "150px",
        }}
      >
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="Name"
            {...register("name")}
            isInvalid={!!errors.name}
          />
        </Form.Group>
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
        <Form.Group controlId="confirmPassword" className="my-2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword")}
            isInvalid={!!errors.confirmPassword}
          />
        </Form.Group>
        <Button type="submit" disabled={loading} className="my-3">
          {loading ? "Loading..." : "Register"}
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

export default Register;
