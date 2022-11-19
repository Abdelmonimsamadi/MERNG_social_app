import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { loginMutation } from "../utils/grahql";

const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const [login, { loading }] = useMutation(loginMutation, {
    variables: values,
    update(_, { data: { loginUser } }) {
      authContext.loginOrRegister(loginUser);
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
    login();
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
        <Button type="submit" loading={loading} disabled={loading}>
          Login
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

export default Login;
