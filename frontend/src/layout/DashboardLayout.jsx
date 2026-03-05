import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { Box, Toolbar } from "@mui/material";

function DashboardLayout({ children }) {

  return (

    <Box sx={{ display: "flex" }}>

      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>

        <Topbar />

        <Toolbar />

        <Box sx={{ p: 3 }}>

          {children}

        </Box>

      </Box>

    </Box>

  );

}

export default DashboardLayout;