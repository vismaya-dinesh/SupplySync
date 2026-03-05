import { createTheme } from "@mui/material/styles";

const theme = createTheme({

  palette: {
    mode: "light",
    primary: {
      main: "#2563eb"
    },
    secondary: {
      main: "#7c3aed"
    },
    background: {
      default: "#f8fafc"
    }
  },

  shape: {
    borderRadius: 12
  },

  typography: {
    fontFamily: "Inter, sans-serif"
  }

});

export default theme;