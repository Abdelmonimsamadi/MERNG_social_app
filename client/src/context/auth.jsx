import { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const initialState = {
  user: null,
  loginOrRegister: () => {},
  logout: () => {},
};

const localStorageToken = localStorage.getItem("jwtToken");
if (localStorageToken) {
  const decodedToken = jwtDecode(localStorageToken);
  if (decodedToken.exp * 1000 > Date.now()) {
    initialState.user = decodedToken;
  } else {
    localStorage.removeItem("jwtToken");
  }
}

export const AuthContext = createContext(initialState);

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export function AuthProvider(props) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  function loginOrRegister(userData) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }
  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, loginOrRegister, logout }}
      {...props}
    />
    //     {props.children}
    // </AuthContext.Provider>
  );
}
