import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
type Props = {
  errorReason: string;
};
export const SearchError = (props: Props) => {
  const { errorReason } = props;
  return (
    <Container sx={{ width: "100%", height: "100vh", display: "flex" }}>
      <Box sx={{ m: "auto" }}>
        <Typography
          variant="h4"
          component="div"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {errorReason}
        </Typography>
      </Box>
    </Container>
  );
};
