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
    steamId?: string,
    register?: boolean
  ) => Promise<void> | void;
}

const inputStyles = {
  '& input::placeholder': {
    color: 'var(--text)',
    opacity: 1,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'var(--text)' },
    '&:hover fieldset': { borderColor: 'var(--primary)' },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary)',
      borderWidth: '2px',
      boxShadow: '0 0 0 6px rgba(216,53,87,0.06)',
    },
  },
};

const RegisterPage: React.FC<RegisterPageProps> = ({ handleLogin }) => {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const steamIdInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState('');
  const [steamId, setSteamId] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const passwordsMatch = password === repeat;

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isDisabled = email.length === 0 ||
    password.length === 0 ||
    repeat.length === 0 ||
    !passwordsMatch || steamId.length <= 16 || steamId.length > 17;

  const navigate = useNavigate();
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = emailInputRef.current?.value || '';
    const password = passwordInputRef.current?.value || '';
    const steamId = steamIdInputRef.current?.value || '';
    await handleLogin(username, password, steamId, true);
    navigate('/user/home');
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
            <FormControl fullWidth sx={{ ...inputStyles }}>
              <TextField
                inputRef={emailInputRef}
                placeholder="Email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormHelperText error sx={{ height: '20px' }}>
                {email.length > 0 && !isValidEmail(email) ? 'Invalid e-mail' : ''}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ ...inputStyles }}>
              <TextField
                inputRef={steamIdInputRef}
                type="text"
                placeholder="Steam ID (min/max 17)"
                fullWidth
                sx={inputStyles}
                onChange={(e) => setSteamId(e.target.value)}
              />
              <FormHelperText error sx={{ height: '20px' }}>
                {steamId.length > 17 || steamId.length <= 16 ? 'Invalid Steam ID' : ''}
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
                {repeat.length > 0 && !passwordsMatch ? 'Passwords are not the same' : ''}
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
              onClick={() => navigate('/login')}
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
