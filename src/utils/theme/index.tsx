import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeContext } from "./context.ts";

export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [darkMode, setDarkMode] = React.useState(() => {
    const savedMode = localStorage?.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleTheme = React.useCallback(() => {
    setDarkMode((prev: boolean) => {
      const newMode = !prev;
      localStorage?.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#23417fff" : "#23417fff",
            light: darkMode ? "#bbdefb" : "#42a5f5",
            dark: darkMode ? "#64b5f6" : "#1565c0",
            contrastText: darkMode ? "#000" : "#fff",
          },
          secondary: {
            main: darkMode ? "#f2c20fff" : "#f2c20fff",
            light: darkMode ? "#f8bbd9" : "#e91e63",
            dark: darkMode ? "#f06292" : "#ad1457",
          },
          background: {
            default: darkMode ? "#121212" : "#fafafa",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "#212121",
            secondary: darkMode ? "#aaaaaa" : "#757575",
          },
          divider: darkMode ? "#333333" : "#e0e0e0",
        },
        typography: {
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(","),
          h1: {
            fontWeight: 600,
            fontSize: "2.5rem",
            lineHeight: 1.2,
          },
          h2: {
            fontWeight: 600,
            fontSize: "2rem",
            lineHeight: 1.3,
          },
          h3: {
            fontWeight: 600,
            fontSize: "1.75rem",
            lineHeight: 1.4,
          },
          h4: {
            fontWeight: 500,
            fontSize: "1.5rem",
            lineHeight: 1.4,
          },
          h5: {
            fontWeight: 500,
            fontSize: "1.25rem",
            lineHeight: 1.5,
          },
          h6: {
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: 1.6,
          },
          body1: {
            fontSize: "1rem",
            lineHeight: 1.6,
          },
          body2: {
            fontSize: "0.875rem",
            lineHeight: 1.6,
          },
        },
        shape: {
          borderRadius: 12,
        },
        spacing: 8,
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 8,
                padding: "8px 16px",
              },
              contained: {
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: darkMode
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: darkMode
                    ? "0 4px 16px rgba(0,0,0,0.4)"
                    : "0 4px 16px rgba(0,0,0,0.15)",
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRadius: "0 12px 12px 0",
                border: "none",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: darkMode
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                margin: "2px 8px",
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.04)",
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
        },
      }),
    [darkMode],
  );

  const value = React.useMemo(
    () => ({
      darkMode,
      toggleTheme,
    }),
    [darkMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
