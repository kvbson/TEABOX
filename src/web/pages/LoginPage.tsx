import React, { useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import TeaboxLogo from '../components/ui/TeaboxLogo';

export interface LoginPageProps {
  handleLogin: (
    username: string,
    password: string,
    register?: boolean
  ) => Promise<void> | void;
}

const inputStyles = {
  '& input::placeholder': {
    color: 'var(--color-text)',
    opacity: 1,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'var(--color-text)' },
    '&:hover fieldset': { borderColor: 'var(--color-primary)' },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primary)',
      borderWidth: '2px',
      boxShadow: '0 0 0 6px rgba(216,53,87,0.06)',
    },
  },
};

const LoginPage: React.FC<LoginPageProps> = ({ handleLogin }) => {
  const loginInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // zatrzymuje domyślne submitowanie formularza
    const username = loginInputRef.current?.value || '';
    const password = passwordInputRef.current?.value || '';

    await handleLogin(username, password, true);
    // jeśli rejestracja się udała, wracamy do login
    // navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          "url('/assets/images/background.png') center/cover no-repeat",
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
        }}
      />

      <Container
        maxWidth="xs"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            backgroundColor: 'rgba(48,31,36,0.85)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <TeaboxLogo />
            <Typography sx={{ mt: 2 }}>
              Steep, sip, and discover great games.
            </Typography>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              inputRef={loginInputRef}
              placeholder="Email"
              fullWidth
              // value={login}
              // onChange={(e) => setLogin(e.target.value)}
              sx={inputStyles}
            />

            <TextField
              inputRef={passwordInputRef}
              type="password"
              placeholder="Password"
              fullWidth
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              sx={inputStyles}
            />

            {/* <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 1,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              onClick={handleLogin('a', 'a')}
            >
              Sign in
            </Button> */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              onClick={onLogin}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
