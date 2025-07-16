import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Loader = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      sx={{
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        color: isDarkMode ? "#ffffff" : "#000000"
      }}
    >
      <CircularProgress size={60} thickness={5} color="inherit" />
      <Typography variant="h6" mt={2}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;
