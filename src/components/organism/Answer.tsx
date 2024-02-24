import { memo, useCallback } from "react";

import { PokemonDetail } from "../../types/Pokemon";
import { SoundButton } from "../atoms/SoundButton";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CardMedia from "@mui/material/CardMedia";
import { Card, CardActionArea } from "@mui/material";

type Props = {
  correctFlag: boolean;
  correctPokedetail?: PokemonDetail;
  open: boolean;
  handleClose: () => void;
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  p: 3,
  boxShadow: 24,
};
export const Answer = memo((props: Props) => {
  const { open, handleClose, correctPokedetail, correctFlag } = props;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="pokename-answer"
      aria-describedby="pokename-answer-detail"
    >
      <Card sx={style}>
        <Typography
          variant="h4"
          component="div"
          color="text.first"
          sx={{ textAlign: "center" }}
        >
          {correctFlag ? "Correct!" : "Wrong!"}
        </Typography>
        <CardActionArea onClick={handleClose}>
          <CardMedia
            component="img"
            height="100%"
            image={
              correctPokedetail?.sprites.other["official-artwork"].front_default
            }
            alt={correctPokedetail?.name}
          />
        </CardActionArea>

        <Typography
          variant="h6"
          component="div"
          color="text.secondary"
          sx={{ textAlign: "left" }}
        >
          No. {("0000" + correctPokedetail?.id).slice(-4)}
        </Typography>
        <Typography
          gutterBottom
          variant="h4"
          component="div"
          sx={{ textAlign: "center" }}
        >
          {correctPokedetail?.name}

          <SoundButton
            text={correctPokedetail ? correctPokedetail?.name : ""}
          />
        </Typography>
        {/* 
          <Box sx={{ textAlign: "left", p: 2 }}>
            <Typography variant="body1" color="text.secondary">
              types:
              {correctPokedetail?.types
                .map((typeObj) => {
                  return typeObj.type.name;
                })
                .join(",")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              height: {correctPokedetail ? correctPokedetail.height / 10 : 0}m
            </Typography>
            <Typography variant="body1" color="text.secondary">
              weight: {correctPokedetail ? correctPokedetail.weight / 10 : 0}
              kg
            </Typography>
            <Typography variant="body1" color="text.secondary">
              abilities:{" "}
              {correctPokedetail?.abilities
                .map((abilityObj) => {
                  return abilityObj.ability.name;
                })
                .join(",")}
            </Typography>
          </Box> */}
      </Card>
    </Modal>
  );
});
