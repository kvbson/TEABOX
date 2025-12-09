// src/components/GameNav.tsx
import React, { useState } from 'react';
import ArrowDivider from './ui/ArrowDivider';
import '../css/gameNav.css';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

interface GameNavProps {
  currentUserId: number;
  steamapp_id: number;
  className?: string;
  title?: string;
  onPrev: () => void;
  onNext: () => void;
  handleBanGame: (args: { currentUserId: number; steamapp_id: number }) => Promise<void>;
}

const BAN_GIF_SRC = '/assets/images/banhammer.gif';
const ANIM_MS = 3200;

const GameNav: React.FC<GameNavProps> = ({
  currentUserId,
  steamapp_id,
  title,
  onPrev,
  onNext,
  className = '',
  handleBanGame,
}) => {
  const theme = useTheme();
  const { palette, zIndex, shadows } = theme;

  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const onBan = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading || animating) return;

    setLoading(true);
    setAnimating(true);

    try {
      const banPromise = handleBanGame({ currentUserId, steamapp_id }).catch(console.error);
      const animTimeout = new Promise((res) => setTimeout(res, ANIM_MS));
      await Promise.all([banPromise, animTimeout]);
    } finally {
      setTimeout(() => setAnimating(false), 80);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Navigation */}
      <div className={`game-nav ${className}`}>
        <button className="nav-button" onClick={onPrev} aria-label="Previous game">
          PREV GAME
          <ArrowDivider className="underlined left" />
        </button>

        {title && (
          <h1 className="game-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 1 }}>{title}</span>

            <form onSubmit={onBan} style={{ margin: 0 }}>
              <Tooltip title="Ban game" arrow>
                <span>
                  <IconButton
                    type="submit"
                    aria-label="Ban game"
                    onClick={onBan}
                    disabled={loading || animating}
                    size="large"
                  >
                    {loading ? (
                      <CircularProgress size={28} />
                    ) : (
                      <RemoveCircleOutline  sx={{ color: palette.primary.main, fontSize: '28px'}} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </form>
          </h1>
        )}

        <button className="nav-button" onClick={onNext} aria-label="Next game">
          NEXT GAME
          <ArrowDivider className="underlined right" />
        </button>
      </div>

      {/* Popup Overlay */}
      <Fade in={animating} timeout={220} unmountOnExit>
        <Box
          role="status"
          aria-live="polite"
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: zIndex.modal + 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.55)',
            pointerEvents: 'auto',
            px: 2,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              mx: 'auto',
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              width: '100%',
              maxWidth: '980px',
              backdropFilter: 'blur(8px) saturate(120%)',
              WebkitBackdropFilter: 'blur(8px) saturate(120%)',
              backgroundColor:
                palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(255,255,255,0.15)',
              boxShadow: shadows[12],
            }}
          >
            {/* Close Button X */}
            <IconButton
              onClick={() => setAnimating(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: palette.grey[300],
                '&:hover': {
                  color: palette.error.light,
                },
              }}
            >
              <CloseIcon fontSize="medium" />
            </IconButton>

            <Box
              component="img"
              src={BAN_GIF_SRC}
              alt="ban"
              sx={{
                width: { xs: '38vw', sm: '240px' },
                maxWidth: '300px',
                height: 'auto',
                borderRadius: 2,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                alignItems: { xs: 'center', sm: 'flex-start' },
                width: '100%',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: palette.primary.main,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  mb: 0.5,
                  textShadow: '0 6px 20px rgba(0,0,0,0.6)',
                }}
              >
                You dropped the ban-hammer
              </Typography>

              {title && (
                <Typography
                  variant="h5"
                  title={title}
                  sx={{
                    color: palette.common.white,
                    fontWeight: 600,
                    opacity: 0.95,
                    textShadow: '0 6px 20px rgba(0,0,0,0.6)',
                    maxWidth: '60ch',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    ml: 1,
                  }}
                >
                  {title}
                </Typography>
              )}

              <Typography variant="body2" sx={{ color: palette.grey[300], mt: 1, ml: 1 }}>
                This game was added to your banned list.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default GameNav;
