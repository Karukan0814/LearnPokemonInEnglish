import { Icon, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
type Props = {
  label: string;
  iconName: string;
  onClickEvent: (condition?: string) => void;
};
export const InputText = (props: Props) => {
  const { label, iconName, onClickEvent } = props;

  const [text, setText] = useState("");
  const onChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
  };

  const onClickSend = () => {
    onClickEvent(text);
    setText("");
  };
  return (
    <>
      <TextField
        id="pokename-text"
        label={label}
        variant="outlined"
        value={text}
        onChange={(e) => {
          onChangeText(e);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onClickEvent();
          }
        }}
      />
      <IconButton onClick={onClickSend}>
        <Icon>{iconName}</Icon>
      </IconButton>
    </>
  );
};
