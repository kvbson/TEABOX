import { Box, Typography } from "@mui/material";
import TeacupIcon from "./TeacupIcon";

const TeaboxLogo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 0.5,
      }}
    >
      <TeacupIcon
        sx={{
          width: 48,
          height: 48,
          objectFit: "contain",
          userSelect: "none",
          transform: "translateY(-6.5px)", 
        }}
      />


      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontFamily: "var(--font-archivo)",
          color: "var(--text)",
          letterSpacing: 1.2,
        }}
      >
        TEABOX
      </Typography>
    </Box>
  );
};

export default TeaboxLogo;

