import { useEffect, useState, memo, useCallback } from "react";
import { usePokeData } from "../../hooks/usePokeData";
import { useFireStore } from "../../hooks/useFireStore";
import { PokemonList, Pokemon, PokemonDetail } from "../../types/Pokemon";
import { useAuth } from "../../hooks/useAuth";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { PokeCard } from "../organism/PokeCard";
import { IconButton, Icon, Container } from "@mui/material";
import { BackDrop } from "../molecules/BackDrop";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import { SearchError } from "./SearchError";
import { UserScoreFromFirestore } from "../../types/FirestoreData";

export const Pokedex = memo(() => {
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [jumpNum, setJumpNum] = useState<number>(1);
  const [pokemonDetails, setPokemonDetails] = useState<Array<PokemonDetail>>(
    []
  );
  const [favoriteList, setFavoriteList] = useState<Array<String>>([]);
  const [score, setScore] = useState<UserScoreFromFirestore>();
  const [allPokeCount, setAllPokeCount] = useState(0);
  const [error, setError] = useState(false);

  const { getFavoriteList, getScore } = useFireStore();
  const { checkLogin } = useAuth();
  const { fetchPokemonList, fetchAnyPokeDataFromUrl } = usePokeData();

  //pokedexに表示するポケモンのリスト
  const getPokemonList = async () => {
    try {
      setLoading(true);
      //ユーザーのお気に入りリストをfirebaseから取得
      const favres = await getFavoriteList();

      //firebaseからスコアを入手
      const score = await getScore();

      //全ポケモンのリストを取得→セット
      const res = await fetchPokemonList(page * rowsPerPage, rowsPerPage);

      //取得したリスト内のポケモンの詳細データを取得する→セット
      //リスト内の各ポケモンの詳細データを取得
      const getEachPokemonDetail = async (results: Array<Pokemon>) => {
        const pokeDetailList = await Promise.all(
          results.map((data) => {
            let pokeDetail = fetchAnyPokeDataFromUrl<PokemonDetail>(data.url);

            return pokeDetail;
          })
        );
        return pokeDetailList;
      };
      const pokeDetailList = await getEachPokemonDetail(res.results);

      if (favres) {
        setFavoriteList(favres);
      }

      if (score) {
        setScore(score);
      }

      setAllPokeCount(res.count);
      setPokemonDetails(pokeDetailList);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 一ページあたりに表示するポケモンの数を変更
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ページネーション
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // 指定のページに遷移
  const jumpToTargetNum = () => {
    if (jumpNum && jumpNum > 0) {
      setPage(jumpNum - 1);
    }
  };

  useEffect(() => {
    //ログイン情報の確認
    checkLogin();

    //ポケモン図鑑のセット
    getPokemonList();
    window.scrollTo(0, 0); //ページ遷移時にページ一番上にスクロールさせておく
  }, [page, rowsPerPage]);

  // // スクロール時に画面上からの距離を記録
  // const onScroll = (e: Event) => {
  //   const window = e.currentTarget as Window;

  //   setScrollValue(window.scrollY);
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", onScroll);
  //   return () => {
  //     window.removeEventListener("scroll", onScroll);
  //   };
  // });
  return (
    <>
      <BackDrop open={loading} />
      {error ? (
        <SearchError errorReason="Sorry! Data doesn't exist!" />
      ) : (
        <Container>
          <Grid
            container
            spacing={{
              xs: 2,
              md: 3,
            }}
          >
            {pokemonDetails.map((poke) => (
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
                    score?.listening.find((el) => el == poke.id) ? true : false
                  }
                  page={page}
                  rowsPerPage={rowsPerPage}
                />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              mt: 2,
              display: "flex",

              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TablePagination
              component="div"
              rowsPerPageOptions={[20, 40, 100]}
              count={allPokeCount}
              page={!allPokeCount || allPokeCount <= 0 ? 0 : page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Box
              sx={{
                ml: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="jumpNum"
                label="jump to the page..."
                variant="standard"
                sx={{ width: 100 }}
                type="number"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                helperText="Please enter num"
                value={jumpNum}
                onChange={(e) => {
                  setJumpNum(Number(e.target.value));
                }}
              />
              <IconButton onClick={jumpToTargetNum}>
                <Icon>skip_next</Icon>
              </IconButton>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
});
