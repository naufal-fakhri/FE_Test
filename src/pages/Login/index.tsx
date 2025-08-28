import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../stores/login/useLogin.ts";

const Container = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh",
  margin: "0 !important",
  fontSize: 16,
});

const LoginCard = styled(Paper)({
  padding: "30px 32px 60px 32px",
  width: "600px",
});

const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "40px",
});

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoading, clearError, isAuthenticated, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login({ username, password });
  };

  if (isAuthenticated) {
    navigate("/dashboard");
  }

  return (
    <Container>
      <LoginCard elevation={3}>
        <Box
          component="img"
          src="/logo-jasa-marga.png"
          alt="Logo Jasa Marga"
          sx={{ alignItems: "center", width: 300 }}
        />
        <Typography variant="h5" mb={2} textAlign="center">
          Portal Login
        </Typography>
        <Form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            type="userName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            error={error !== null}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error !== null}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            loading={isLoading}
          >
            Login
          </Button>
        </Form>
      </LoginCard>
    </Container>
  );
};

export default LoginScreen;
