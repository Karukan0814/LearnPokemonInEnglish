import { memo } from "react";
import { IconButton, Icon } from "@mui/material";
type Props = {
  text: string;
};
export const SoundButton = memo((props: Props) => {
  const { text } = props;

  const onClickSound = () => {
    let u = new SpeechSynthesisUtterance();
    u.lang = "en-US";
    u.text = text;
    speechSynthesis.speak(u);
  };
  return (
    <IconButton onClick={onClickSound}>
      <Icon fontSize="large">volume_up</Icon>
    </IconButton>
  );
});
