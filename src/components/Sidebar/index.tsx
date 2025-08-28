import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/theme/hook.ts";
import type { ResponsiveDrawerTypes } from "./sidebarTypes.ts";
import { sidebarMenu } from "./sidebarMenu.ts";
import { useLogin } from "../../stores/login/useLogin.ts";
import { Button } from "@mui/material";

export default function ResponsiveDrawer({ children }: ResponsiveDrawerTypes) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { darkMode } = useTheme();

  const navigate = useNavigate();

  const handleListItemClick = (path: string) => {
    navigate(path);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const { logout } = useLogin();

  const isLoginScreen = window.location.pathname === "/login";

  const drawerWidth = isLoginScreen ? 0 : 240;
  const getMenuIcon = (link: string) => {
    switch (link) {
      case "/dashboard":
        return <DashboardIcon />;
      case "/laporan-lalin":
        return <AssessmentIcon />;
      case "/master-gerbang":
        return <AccountTreeIcon />;
      default:
        return <InboxIcon />;
    }
  };

  const drawer = (
    <div>
      <List>
        {sidebarMenu.map((item) => (
          <ListItem key={item.link} disablePadding>
            <ListItemButton
              selected={item.link === window.location.pathname}
              onClick={() => handleListItemClick(item.link)}
            >
              <ListItemIcon>{getMenuIcon(item.link)}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar only renders when not on login screen */}
      {!isLoginScreen && (
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            sx={{
              backgroundColor: darkMode ? "#1F2937" : "#F4F4F4",
              color: darkMode ? "#ffffff" : "#000000",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component="img"
              src="/logo-jasa-marga.png"
              alt="Logo Jasa Marga"
              sx={{ height: 50, display: "block" }}
            />

            <Box sx={{ flexGrow: 1 }} />
            <Button variant="outlined" color="primary" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}

      {/* Navigation Drawer */}
      {!isLoginScreen && (
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            slotProps={{ root: { keepMounted: true } }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                mt: 8,
                height: `calc(100% - 64px)`,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: isLoginScreen ? "100%" : `calc(100% - ${drawerWidth}px)`,
          },
          mt: 5,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
