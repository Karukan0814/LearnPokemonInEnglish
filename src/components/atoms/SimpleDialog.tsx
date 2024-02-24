import { Dialog, DialogTitle, Popover, Typography } from "@mui/material";
import React from "react";

type Props = {
  text: string;
  handleClose: () => void;
  open: boolean;
};
export const SinmpleDialog = (props: Props) => {
  const { handleClose, text, open } = props;

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{text}</DialogTitle>
    </Dialog>
  );
};
