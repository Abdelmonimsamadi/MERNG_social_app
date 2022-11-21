import React, { useContext } from "react";
import { Button, Form } from "semantic-ui-react";
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
    <div className="form-container">
      <Form
        onSubmit={handleSubmit(onsubmit)}
        style={{
          width: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "150px",
        }}
      >
        <Form.Field error={errors.name ? true : false}>
          <label>Name</label>
          <input placeholder="Name" {...register("name")} />
        </Form.Field>
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
        <Form.Field error={errors.confirmPassword ? true : false}>
          <label>Confirm password</label>
          <input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword")}
          />
        </Form.Field>
        <Button type="submit" loading={loading} disabled={loading}>
          Register
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

export default Register;
