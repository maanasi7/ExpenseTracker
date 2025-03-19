import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { SIGNUP } from "../graphql/mutation";

import { Typography, Input, Button, Divider, Container, Link } from "@mui/joy";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [signup] = useMutation(SIGNUP, {
    onCompleted: (data) => {
      navigate("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ variables: { username, email, phone, password } });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography level="h1" color="neutral" sx={{ mb: 2 }}>
        Sign Up
      </Typography>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "10px" }}>
        <Input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="on"
          placeholder="Username"
          variant="solid"
          sx={{ mb: 1 }}
        />
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="on"
          placeholder="Email"
          variant="solid"
          sx={{ mb: 1 }}
        />
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="on"
          placeholder="Phone Number"
          variant="solid"
          sx={{ mb: 1 }}
        />
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="on"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          variant="solid"
          sx={{ mb: 1 }}
        />
        <Button type="submit">Sign Up</Button>
      </form>

      <Divider sx={{ mb: 1 }} />

      <Link href="/">Have an account?</Link>
    </Container>
  );
}

export default Signup;
