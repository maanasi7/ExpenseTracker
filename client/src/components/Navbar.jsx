import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import React from "react";
import { CssBaseline, Switch, FormControlLabel } from "@mui/material";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ mb: 2 }}>
        <AppBar position="static" color="inherit">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" component="h1">
              Dashboard
            </Typography>

            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default Navbar;
