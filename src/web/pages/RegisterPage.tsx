import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import TeaboxLogo from '../components/ui/TeaboxLogo';
import { useNavigate } from 'react-router-dom';

export interface RegisterPageProps {
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

const RegisterPage: React.FC<RegisterPageProps> = ({ handleLogin }) => {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const passwordsMatch = password === repeat;

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isDisabled = email.length === 0 ||
    password.length === 0 ||
    repeat.length === 0 ||
    !passwordsMatch;

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // zatrzymuje domyślne submitowanie formularza
    const username = emailInputRef.current?.value || '';
    const password = passwordInputRef.current?.value || '';
    await handleLogin(username, password, true);
  };
  const navigate = useNavigate();

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
            <FormControl fullWidth sx={{ ...inputStyles }}>
              <TextField
                inputRef={emailInputRef}
                placeholder="Email"
                fullWidth
                sx={inputStyles}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormHelperText error sx={{ height: '20px' }}>
                {email.length > 0 && !isValidEmail(email) ? 'Niepoprawny adres e-mail' : ''}
              </FormHelperText>
            </FormControl>

            <TextField
              type="password"
              placeholder="Password"
              fullWidth
              sx={inputStyles}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControl fullWidth sx={{ ...inputStyles }}>
              <TextField
                inputRef={passwordInputRef}
                type="password"
                placeholder="Repeat password"
                onChange={(e) => setRepeat(e.target.value)}
                error={repeat.length > 0 && !passwordsMatch}
              />
              <FormHelperText error sx={{ height: '20px' }}>
                {repeat.length > 0 && !passwordsMatch ? 'Hasła nie są takie same' : ''}
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              onClick={onLogin}
              disabled={isDisabled}
            >
      Register
            </Button>

            <Button
              type="button"
              variant="contained"
              fullWidth
              onClick={() => navigate('/')}
            >
      Back to login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
