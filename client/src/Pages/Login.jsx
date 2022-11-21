import { useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
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
    <div className="form-container">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "150px",
        }}
      >
        <Form.Field error={errors.email ? true : false}>
          <label>Email</label>
          <input placeholder="Email" {...register("email")} />
        </Form.Field>
        <Form.Field error={errors.password ? true : false}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
        </Form.Field>
        <Button type="submit" loading={loading} disabled={loading}>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul>
            {Object.values(errors).map((input, i) => (
              <li key={i}>{input.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;
