import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: "100%", borderRadius: 3 }}>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5" fontWeight={600}>
            Logowanie
          </Typography>
        </Box>

        {/* FORM */}
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Email"
            sx={{
              '& .MuiOutlinedInput-input::placeholder': {
                color: 'var(textPrimary)',
                opacity: 1,
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset, & .MuiOutlinedInput": {
                  border: "1px solid",
                },
              },
            }}
          />
          <TextField
            type="password"
            placeholder="Password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
               sx={{
              '& .MuiOutlinedInput-input::placeholder': {
                color: 'var(textPrimary)',
                opacity: 1,
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset, & .MuiOutlinedInput": {
                  border: "1px solid",
                },
              },
            }}
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 1 }}
            onClick={onLogin}    // 🔥 zachowujemy Twoją logikę
          >
            Zaloguj się
          </Button>
        </Box>

      </Paper>
    </Container>
  );
};

export default LoginPage;
