import { Box, Typography } from "@mui/material";
import teacupIcon from "../../../../public/assets/images/teacup-default.png"

const TeaboxLogo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 1.5,
      }}
    >
      <Box
        component="img"
        src={teacupIcon}
        alt="Teabox cup"
        sx={{
          width: 48,
          height: 48,
          objectFit: "contain",
          userSelect: "none",
          transform: "translateY(-7px)", 
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontFamily: "var(--font-archivo)",
          color: "var(--color-text)",
          letterSpacing: 1.2,
        }}
      >
        TEABOX
      </Typography>
    </Box>
  );
};

export default TeaboxLogo;
