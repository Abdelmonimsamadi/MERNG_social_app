import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

export default function () {
  const { user, logout } = useContext(AuthContext);
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (_, { name }) => setActiveItem(name);

  return (
    <Menu size="large">
      <Menu.Item
        name={user ? user.name : "home"}
        active={activeItem === "home"}
        as={Link}
        to="/"
        onClick={handleItemClick}
      />
      {user ? (
        <Menu.Item
          name="logout"
          active={activeItem === "logout"}
          onClick={logout}
          position="right"
        />
      ) : (
        <>
          <Menu.Item
            name="login"
            active={activeItem === "login"}
            as={Link}
            to="/login"
            onClick={handleItemClick}
            position="right"
          />
          <Menu.Item
            name="register"
            active={activeItem === "register"}
            as={Link}
            to="/register"
            onClick={handleItemClick}
          />
        </>
      )}
    </Menu>
  );
}
