import { useState, memo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { MenuDrawer } from "../molecules/MenuDrawer";

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Icon from "@mui/material/Icon";

export const Header = memo(() => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const { signOutUser } = useAuth();

  const handleDrawerToggle = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 250px)` },
          ml: { sm: "250px" },
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <Icon>menu</Icon>
          </IconButton>
          <div style={{ flexGrow: 1 }}></div>
          <Button onClick={signOutUser} variant="text" color="inherit">
            SignOut
          </Button>
        </Toolbar>
      </AppBar>
      <MenuDrawer drawerOpen={openDrawer} toggleDrawer={handleDrawerToggle} />
    </>
  );
});
