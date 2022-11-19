import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { registerMutation } from "../utils/grahql";

const Register = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [register, { loading }] = useMutation(registerMutation, {
    variables: { user: values },
    update(_, { data: { registerUser } }) {
      authContext.loginOrRegister(registerUser);
      navigate("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors || {});
    },
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register();
  };

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "150px",
        }}
      >
        <Form.Field error={errors.name ? true : false}>
          <label>Name</label>
          <input placeholder="Name" name="name" onChange={handleChange} />
        </Form.Field>
        <Form.Field error={errors.email ? true : false}>
          <label>Email</label>
          <input placeholder="Email" name="email" onChange={handleChange} />
        </Form.Field>
        <Form.Field error={errors.password ? true : false}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field error={errors.confirmPassword ? true : false}>
          <label>Confirm password</label>
          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
          />
        </Form.Field>
        <Button loading={loading} type="submit" disabled={loading}>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul>
            {Object.values(errors).map((value, i) => (
              <li key={i}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Register;
