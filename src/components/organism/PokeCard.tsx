import { PokemonDetail } from "../../types/Pokemon";
import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SoundButton } from "../atoms/SoundButton";
import { useFireStore } from "../../hooks/useFireStore";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

type Props = {
  pokeDetail: PokemonDetail;
  favoriteFlagFromProps: boolean;
  readingFlag: boolean;
  spellingFlag: boolean;
  listeningFlag: boolean;
  page?: number;
  rowsPerPage?: number;
};
export const PokeCard = memo((props: Props) => {
  const {
    pokeDetail,
    favoriteFlagFromProps,
    readingFlag,
    spellingFlag,
    listeningFlag,
    page,
    rowsPerPage,
  } = props;
  const [favariteFlag, setFavoriteFlag] = useState(favoriteFlagFromProps);
  const imgUrl = pokeDetail.sprites.front_default;

  const navigate = useNavigate();

  const { saveFavorite } = useFireStore();

  const onClickSaveFavorite = () => {
    //favoriteFlagを反転させる
    setFavoriteFlag(!favariteFlag);

    //firebaseにデータ保存
    saveFavorite(pokeDetail.id, favariteFlag);
  };

  const onClickPokeCard = () => {
    const pageInfoObj = {
      scrollY: scrollY,
      page: page,
      rowsPerPage: rowsPerPage,
    };
    const pageInfoStr = JSON.stringify(pageInfoObj);
    localStorage.setItem("pageInfo", pageInfoStr);
    navigate(`/pokedex/${pokeDetail.id}`);
  };

  return (
    <Card sx={{ height: "100%", maxWidth: "350px", mx: "auto" }}>
      <></>
      <CardActionArea onClick={onClickPokeCard}>
        <CardMedia
          component="img"
          height="300"
          image={imgUrl}
          alt={pokeDetail.name}
          sx={{ objectFit: "contain" }}
        />
      </CardActionArea>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          color="text.secondary"
          sx={{ textAlign: "left" }}
        >
          No. {("0000" + pokeDetail.id).slice(-4)}
        </Typography>
        <Typography gutterBottom variant="h4" component="div">
          {pokeDetail.name}
          <SoundButton text={pokeDetail.name} />
        </Typography>

        <Box sx={{ textAlign: "left", ml: 2 }}>
          <Typography variant="body2" color="text.secondary">
            types:{" "}
            {pokeDetail.types
              .map((typeObj) => {
                return typeObj.type.name;
              })
              .join(",")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            height: {pokeDetail.height / 10}m
          </Typography>
          <Typography variant="body2" color="text.secondary">
            weight: {pokeDetail.weight / 10}kg
          </Typography>
          <Typography variant="body2" color="text.secondary">
            abilities:{" "}
            {pokeDetail.abilities
              .map((abilityObj) => {
                return abilityObj.ability.name;
              })
              .join(",")}
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {readingFlag ? (
            <Icon color="primary">import_contacts</Icon>
          ) : (
            <Icon color="disabled">import_contacts</Icon>
          )}
          {spellingFlag ? (
            <Icon color="primary">edit</Icon>
          ) : (
            <Icon color="disabled">edit</Icon>
          )}
          {listeningFlag ? (
            <Icon color="primary">hearing</Icon>
          ) : (
            <Icon color="disabled">hearing</Icon>
          )}
        </div>

        <IconButton onClick={onClickSaveFavorite}>
          {favariteFlag ? (
            <Icon color="primary">favorite</Icon>
          ) : (
            <Icon>favorite</Icon>
          )}
        </IconButton>
      </Box>
    </Card>
  );
});
