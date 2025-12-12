import React, { useRef } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import TeaboxLogo from '../components/ui/TeaboxLogo';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

export interface LoginPageProps {
  handleLogin: (
    username: string,
    password: string,
    register?: boolean
  ) => Promise<void> | void;
}

const inputStyles = {
  '& input::placeholder': {
    color: 'var(--text)',
    opacity: 1,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'var(--primary)' },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary)',
      borderWidth: '2px',
      boxShadow: '0 0 0 6px rgba(216,53,87,0.06)',
    },
    color: 'var(--text)',
  },
  input: {
    color: 'var(--text)',
  },
  '& .MuiInputLabel-root': {
    color: 'var(--text)',
  },
};

const LoginPage: React.FC<LoginPageProps> = ({ handleLogin }) => {
  const loginInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = loginInputRef.current?.value || '';
    const password = passwordInputRef.current?.value || '';
    await handleLogin(username, password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: "url('/assets/images/background.png') center/cover no-repeat",
        position: 'relative',
        color: 'var(--text)',
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
            backgroundColor: 'var(--paper)',
            color: 'var(--text)',
            boxShadow: (theme) => theme.shadows[6],
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <TeaboxLogo />
            <Typography sx={{ mt: 2, color: 'var(--text)' }}>
              Steep, sip, and discover great games.
            </Typography>
          </Box>

          <Box component="form" onSubmit={onLogin} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              inputRef={loginInputRef}
              placeholder="Email"
              fullWidth
              sx={inputStyles}
              variant="outlined"
            />

            <TextField
              inputRef={passwordInputRef}
              type="password"
              placeholder="Password"
              fullWidth
              sx={inputStyles}
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Login
            </Button>

            <Typography sx={{ mt: 2, color: 'var(--text)' }}>
              Don't have an account?{' '}
              <Link component="button" onClick={() => navigate('/register')} sx={{ color: 'var(--primary)' }}>
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
