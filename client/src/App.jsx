import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./App.css";

import Navbar from "./components/Navbar";
// Pages
import Posts from "./Pages/Posts";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import SinglePost from "./Pages/SinglePost";

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Navbar />
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="post/:id" element={<SinglePost />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
