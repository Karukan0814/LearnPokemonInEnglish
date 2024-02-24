import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Modal } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
type Props = {
  open: boolean;
  handleClose: () => void;
};

export const Signin = memo((props: Props) => {
  const { open, handleClose } = props;

  const [hasAccount, setHasAccount] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUpWithEmail, signInWithEmail, signInGoogle, resetPassword } =
    useAuth();

  const onClickSignIn = async () => {
    setLoading(true);
    const result = await signInWithEmail(email, password);
    setLoading(result);
  };
  const onClickSignInWithGoogle = async () => {
    setLoading(true);
    const result = await signInGoogle();
    setLoading(result);
  };
  const onClickSignUp = async () => {
    setLoading(true);
    const result = await signUpWithEmail(name, email, password);
    setLoading(result);
  };

  const onClickResetPassword = () => {
    resetPassword(email);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Icon>lock_open</Icon>

            <Typography component="h1" variant="h5">
              {hasAccount ? "Sign in" : "Register"}
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {!hasAccount && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  disabled={loading}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                disabled={loading}
              />
              {hasAccount ? (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={onClickSignIn}
                  disabled={loading}
                >
                  Sign In
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={onClickSignUp}
                  disabled={loading}
                >
                  Sign up
                </Button>
              )}
              {hasAccount && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Icon></Icon>}
                  onClick={onClickSignInWithGoogle}
                  disabled={loading}
                >
                  <Icon sx={{ mr: 1 }}>camera</Icon>
                  Signin with Google
                </Button>
              )}
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Button
                    variant="text"
                    disabled={loading}
                    onClick={onClickResetPassword}
                  >
                    Forgot password?
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="text"
                    onClick={() => setHasAccount(!hasAccount)}
                    disabled={loading}
                  >
                    {hasAccount ? "Create new account" : "Back to Login"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Modal>
    </>
  );
});
