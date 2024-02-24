import { useState, useEffect, memo, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  PokemonDetail,
  PokemonSpecies,
  EvolutionChain,
} from "../../types/Pokemon";
import { Link } from "react-router-dom";
import { SoundButton } from "../atoms/SoundButton";
import { useNavigate } from "react-router-dom";
import { SearchError } from "./SearchError";
import { useAuth } from "../../hooks/useAuth";
import { usePokeData } from "../../hooks/usePokeData";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Table } from "@mui/material";
import Paper from "@mui/material/Paper";
import { BackDrop } from "../molecules/BackDrop";

type evolutionChain = {
  chainNum: string;
  first?: string;
  second?: string;
  third?: string;
};

export const PokemonDetailedInfo = memo(() => {
  const { id } = useParams();

  const navigation = useNavigate();
  const {
    fetchPokemonDetailWithCondition,
    fetchPokemonSpeciesWithCondition,
    fetchAnyPokeDataFromUrl,
  } = usePokeData();
  const { checkLogin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [pokeDetail, setPokeDetail] = useState<PokemonDetail>();
  const [pokeSpeciesData, setPokeSpeciesData] = useState<PokemonSpecies>();
  const [evChain, setEvChain] = useState<Array<evolutionChain>>();
  const [error, setError] = useState(false);

  const getPokedata = async (condition: string) => {
    setLoading(true);
    try {
      const pokedetail = await fetchPokemonDetailWithCondition(condition);

      //spieciesのデータ取得
      const pokeSpecies = await fetchPokemonSpeciesWithCondition(condition);

      const getEvolution = async (condition: string) => {
        //spieciesのevolutionUrlから進化データを取得
        const resEv = await fetchAnyPokeDataFromUrl<EvolutionChain>(condition);

        //evolutionChainの入れ子を紐解いていく
        let evArray: Array<evolutionChain> = [];

        let startPoke = resEv.chain.species.name;

        for (let i = 0; i < resEv.chain.evolves_to.length; i++) {
          let secondEv = resEv.chain.evolves_to[i];

          let thirdEv = secondEv.evolves_to;

          let obj: evolutionChain = {
            chainNum: (i + 1).toString(),
            first: startPoke,
            second: secondEv.species.name,
            third: "",
          };

          if (thirdEv.length > 0) {
            for (let j = 0; j < thirdEv.length; j++) {
              obj = {
                chainNum: ((i + 1) * (j + 1)).toString(),
                first: startPoke,
                second: secondEv.species.name,
                third: thirdEv[j].species.name,
              };
              evArray.push(obj);
            }
          } else {
            evArray.push(obj);
          }
        }

        for (let i = 0; i < evArray.length; i++) {
          if (i !== 0) {
            evArray[i] = {
              chainNum: evArray[i].chainNum,
              first: "",
              second:
                evArray[i - 1].second === evArray[i].second
                  ? ""
                  : evArray[i].second,
              third:
                evArray[i - 1].third === evArray[i].third
                  ? ""
                  : evArray[i].third,
            };
          }
        }
        return evArray;
      };
      const evArray = await getEvolution(pokeSpecies.evolution_chain.url);

      setPokeDetail(pokedetail);
      setPokeSpeciesData(pokeSpecies);
      setEvChain(evArray);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //ログイン情報の確認
    checkLogin();
    if (id) {
      getPokedata(id);
    } else {
      navigation("/pokedex");
    }
  }, [id]);

  return (
    <>
      <BackDrop open={loading} />
      {error ? (
        <SearchError errorReason="Sorry! Data doesn't exist!" />
      ) : (
        <Box sx={{ mx: "auto", textAlign: "center", maxWidth: "700px" }}>
          <Box sx={{ textAlign: "left", width: "100%" }}>
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {
                navigation(-1);
              }}
            >
              <Icon>arrow_back</Icon>Back
            </IconButton>
          </Box>
          <Typography variant="h4">
            {pokeDetail?.name} /{" "}
            {
              pokeSpeciesData?.names.find(
                (element) => element.language.name === "ja-Hrkt"
              )?.name
            }
            <SoundButton text={pokeDetail ? pokeDetail.name : ""} />
          </Typography>
          <Box
            sx={{
              display: { sm: "flex" },
              justifyContent: "space-between",
            }}
          >
            <img
              src={pokeDetail?.sprites.other["official-artwork"].front_default}
              alt={`${pokeDetail?.id} front-image`}
              width="300"
              height="300"
              loading="lazy"
            />

            <TableContainer aria-label="simple table">
              <Table>
                <TableBody>
                  <TableRow key="height">
                    <TableCell>height</TableCell>
                    <TableCell>{`${
                      pokeDetail ? pokeDetail.height / 10 : "-"
                    }m`}</TableCell>
                  </TableRow>
                  <TableRow key="weight">
                    <TableCell>weight</TableCell>
                    <TableCell>{`${
                      pokeDetail ? pokeDetail.weight / 10 : "-"
                    }kg`}</TableCell>
                  </TableRow>
                  <TableRow key="genre">
                    <TableCell>genre</TableCell>
                    <TableCell>
                      {
                        pokeSpeciesData?.genera.find(
                          (el) => el.language.name === "en"
                        )?.genus
                      }
                      /
                      {
                        pokeSpeciesData?.genera.find(
                          (el) => el.language.name === "ja-Hrkt"
                        )?.genus
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow key="types">
                    <TableCell>types</TableCell>
                    <TableCell>
                      {pokeDetail?.types
                        .map((type) => {
                          return type.type.name;
                        })
                        .join(",")}
                    </TableCell>
                  </TableRow>

                  <TableRow key="abilities">
                    <TableCell>abilities</TableCell>
                    <TableCell>
                      {pokeDetail?.abilities
                        .map((ability) => {
                          return ability.ability.name;
                        })
                        .join(",  ")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ p: 2, textAlign: "left" }}>
            {
              pokeSpeciesData?.flavor_text_entries.find(
                (el) => el.language.name === "en"
              )?.flavor_text
            }
          </Box>

          <Container>
            <TableContainer
              component={Paper}
              sx={{ minWidth: 300, maxWidth: 700 }}
            >
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "primary.main" }}>
                    <TableCell align="left">evolution pattern</TableCell>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">2</TableCell>
                    <TableCell align="right">3</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {evChain?.map((ev) => (
                    <TableRow
                      key={ev.chainNum}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>pattern {ev.chainNum}</TableCell>
                      <TableCell align="right">
                        {ev.first ? (
                          <Link to={`/pokedex/${ev.first}`}>{ev.first}</Link>
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {ev.second ? (
                          <Link to={`/pokedex/${ev.second}`}>{ev.second}</Link>
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {ev.third ? (
                          <Link to={`/pokedex/${ev.third}`}>{ev.third}</Link>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Box>
      )}
    </>
  );
});
