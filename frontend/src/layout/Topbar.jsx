import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from "@mui/material";

import { useNavigate } from "react-router-dom";

function Topbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  return (

    <AppBar
      position="fixed"
      sx={{
        ml: "220px",
        width: "calc(100% - 220px)"
      }}
    >

      <Toolbar>

        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          Dashboard
        </Typography>

        <Button
          color="inherit"
          onClick={logout}
        >
          Logout
        </Button>

      </Toolbar>

    </AppBar>

  );

}

export default Topbar;