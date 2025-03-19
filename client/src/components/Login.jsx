import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../graphql/mutation";
import { Typography, Input, Button, Divider, Link, Container } from "@mui/joy";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data?.login?.user?.username && data?.login?.token) {
        localStorage.setItem("username", data.login.user.username);
        localStorage.setItem("token", data.login.token);
        console.log(
          `Username from login page: ${localStorage.getItem(
            "username"
          )} and ${localStorage.getItem("token")}`
        );
        navigate("/dashboard");
      }
      onError: (error) => {
        setError(error.message);
      };
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography level="h1" component="h1" color="neutral" sx={{ mb: 2 }}>
        Login
      </Typography>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
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
        <Button type="submit" sx={{ marginBottom: 2 }}>
          Login
        </Button>
      </form>

      <Divider sx={{ mb: 1 }} />

      <form>
        <Link href="/signup">Don't have an account?</Link>
      </form>
    </Container>
  );
}

export default Login;
