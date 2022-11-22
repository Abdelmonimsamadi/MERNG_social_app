import React, { useState, useContext } from "react";
// import { Menu } from "semantic-ui-react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

export default function () {
  const { user, logout } = useContext(AuthContext);
  const handleItemClick = () => {};
  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleItemClick}>
          Home
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            <Nav>
              <NavDropdown
                title={`Welcome, ${user.name}`}
                id="basic-nav-dropdown"
              >
                {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item> */}
                {/* <NavDropdown.Divider /> */}
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/login" onClick={handleItemClick}>
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" onClick={handleItemClick}>
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    // <Menu size="large">
    //   <Menu.Item
    //     name={user ? user.name : "home"}
    //     active={activeItem === "home"}
    //     as={Link}
    //     to="/"
    //     onClick={handleItemClick}
    //   />
    //   {user ? (
    //     <Menu.Item
    //       name="logout"
    //       active={activeItem === "logout"}
    //       onClick={logout}
    //       position="right"
    //     />
    //   ) : (
    //     <>
    //       <Menu.Item
    //         name="login"
    //         active={activeItem === "login"}
    //         as={Link}
    //         to="/login"
    //         onClick={handleItemClick}
    //         position="right"
    //       />
    //       <Menu.Item
    //         name="register"
    //         active={activeItem === "register"}
    //         as={Link}
    //         to="/register"
    //         onClick={handleItemClick}
    //       />
    //     </>
    //   )}
    // </Menu>
  );
}
