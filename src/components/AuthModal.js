import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { loginUser, registerUser } from "../api/authApi";

const AuthModal = ({
  isOpen,
  toggle,
  setIsLogin,
  isLogin,
  updateLoginStatus,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [venueManager, setVenueManager] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(email, password);
    if (response.success) {
      console.log("Logged in successfully");
      updateLoginStatus(true);
      toggle();
    } else {
      alert(`Login failed: ${response.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerUser(
      name,
      email,
      password,
      avatar,
      venueManager
    );
    if (response.success) {
      alert("Registration successful!");
      setIsLogin(true);
    } else {
      alert(`Registration failed: ${response.message}`);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isLogin ? "Login" : "Register"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          {!isLogin && (
            <>
              <FormGroup>
                <Label for="avatar">Avatar URL (Optional)</Label>
                <Input
                  type="url"
                  id="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="venueManager" style={{ marginRight: "10px" }}>
                  Venue Manager
                </Label>
                <Input
                  type="checkbox"
                  id="venueManager"
                  checked={venueManager}
                  onChange={(e) => setVenueManager(e.target.checked)}
                />
              </FormGroup>
            </>
          )}
          <Button type="submit" color="primary">
            {isLogin ? "Login" : "Register"}
          </Button>
        </Form>
      </ModalBody>
      <ModalFooter>
        <p>
          {isLogin ? "New to Holidaze?" : "Already have an account?"}
          <Button color="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up here" : "Log in here"}
          </Button>
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default AuthModal;
