import { useEffect, useState, memo, useCallback } from "react";
import { usePokeData } from "../../hooks/usePokeData";
import { useFireStore } from "../../hooks/useFireStore";
import { PokemonDetail } from "../../types/Pokemon";
import { useAuth } from "../../hooks/useAuth";
import { inputValidator } from "../../common/inputValidator";
import { SearchError } from "./SearchError";
import { useParams } from "react-router-dom";

import { PokeCard } from "../organism/PokeCard";
import { BackDrop } from "../molecules/BackDrop";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { UserScoreFromFirestore } from "../../types/FirestoreData";

export const PokedexGeneration = memo(() => {
  const { generationId } = useParams();

  const [error, setError] = useState(false);
  const [filterChecked, setFilterChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState<Array<PokemonDetail>>(
    []
  );
  const [filteredList, setfilteredList] = useState<Array<PokemonDetail>>([]);
  const [favoriteList, setFavoriteList] = useState<Array<String>>([]);
  const [score, setScore] = useState<UserScoreFromFirestore>();
  const { getFavoriteList, getScore } = useFireStore();
  const { checkLogin } = useAuth();
  const { fetchEachGenerationPokeList, fetchPokemonDetailWithCondition } =
    usePokeData();
  const { validateSearchGeneration } = inputValidator();

  //pokedexに表示するポケモンのリスト
  const getPokemonList = async () => {
    try {
      setLoading(true);
      //ユーザーのお気に入りリストをfirebaseから取得→セット

      const favlist = await getFavoriteList();

      const score = await getScore();
      //generationIdのチェック
      const error = validateSearchGeneration(generationId);
      if (error) {
        setError(true);
      } else {
        const detailList = await fetchEachGenerationPokeList(generationId!);

        if (favlist) {
          setFavoriteList(favlist);
        }
        if (score) {
          setScore(score);
        }

        if (detailList) {
          setPokemonDetails(detailList);
          setfilteredList(detailList);
        } else {
          setError(true);
        }
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFilter = async () => {
    setFilterChecked(!filterChecked);
    const favoriteList = await getFavoriteList();
    //表示するポケモンをお気に入りかどうかで切り替え
    if (filterChecked) {
      setfilteredList(pokemonDetails);
    } else {
      const newList = pokemonDetails.filter((poke) => {
        return favoriteList!.find((el) => el == poke.id);
      });

      setfilteredList(newList);
    }
  };

  useEffect(() => {
    //ログイン情報の確認
    checkLogin();

    //ポケモン図鑑のセット
    getPokemonList();
  }, [generationId]);

  return (
    <>
      {error ? (
        <SearchError errorReason={"Sorry! Data doesn't exist!"} />
      ) : (
        <Container
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Container sx={{ position: "relative", top: "0", left: "0" }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={filterChecked}
                    onChange={handleChangeFilter}
                  />
                }
                label="Favorites"
              />
            </FormGroup>
          </Container>
          <Container>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 6, md: 12 }}
            >
              {filteredList.map((poke) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  key={poke.id}
                  sx={{ px: 2, mx: "auto" }}
                >
                  <PokeCard
                    pokeDetail={poke}
                    favoriteFlagFromProps={
                      favoriteList.find((el) => el == poke.id) ? true : false
                    }
                    readingFlag={
                      score?.reading.find((el) => el == poke.id) ? true : false
                    }
                    spellingFlag={
                      score?.spelling.find((el) => el == poke.id) ? true : false
                    }
                    listeningFlag={
                      score?.listening.find((el) => el == poke.id)
                        ? true
                        : false
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
          <BackDrop open={loading} />
        </Container>
      )}
      <BackDrop open={loading} />
    </>
  );
});
