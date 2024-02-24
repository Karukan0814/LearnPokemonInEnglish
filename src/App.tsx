import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; //リセットCSS
import { Router } from "./route/Router";
import { RecoilRoot } from "recoil";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#63a4ff",
        main: "#0097a7", //test
        dark: "#004ba0",
        contrastText: "#fff",
      },
      secondary: {
        light: "#5ddef4",
        main: "#00acc1",
        dark: "#007c91",
        contrastText: "#000",
      },
    },
  });

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router />
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
