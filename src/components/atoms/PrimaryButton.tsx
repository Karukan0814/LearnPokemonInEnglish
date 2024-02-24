import { memo } from "react";
import Button from "@mui/material/Button";

type Props = {
  text: string;
  onClick: () => void;
};

export const PrimaryButton = memo((props: Props) => {
  const { text, onClick } = props;
  return (
    <Button variant="contained" onClick={onClick} color="primary">
      {text}
    </Button>
  );
});
