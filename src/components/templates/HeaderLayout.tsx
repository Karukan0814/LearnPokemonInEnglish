import { ReactNode, memo } from "react";
import { Header } from "../organism/Header";
import Box from "@mui/material/Box";
import { Toolbar } from "@mui/material";

type Props = {
  children: ReactNode;
};

export const HeaderLayout = memo((props: Props) => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Header />

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 250px)` } }}
        >
          <Toolbar />

          {props.children}
        </Box>
      </Box>
    </>
  );
});
