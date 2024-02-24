import { useEffect, useState } from "react";
import {
  Container,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import Typography from "@mui/material/Typography";
import { useFireStore } from "../../hooks/useFireStore";
import { useRecoilState } from "recoil";
import { userState } from "../../store/userState";
import { generationSet } from "../../common/define";

type generationScoreType = {
  generation: string;
  count: number;
  listening?: string[];
  spelling?: string[];
  reading?: string[];
};

export const Score = () => {
  const { getScore } = useFireStore();

  const [userInfo] = useRecoilState(userState); //recoilにユーザー情報

  const [generationScore, setGenerationScore] =
    useState<generationScoreType[]>();

  const getUserScore = async () => {
    const userScoreFireStore = await getScore();

    let scoreList: generationScoreType[] = [];
    for (const generation of generationSet) {
      const generationList = generation.idList.map((el) => {
        return el.toString();
      });
      const generationCount = generation.idList.length;

      if (generation.name === "All") {
        let sumScore: generationScoreType = {
          generation: generation.name,
          count: generation.count,
          listening: userScoreFireStore?.listening,
          spelling: userScoreFireStore?.spelling,
          reading: userScoreFireStore?.reading,
        };

        scoreList.push(sumScore);
        continue;
      }

      const geneReadingList: string[] = [];
      const geneSpellingList: string[] = [];
      let geneListeningList: string[] = [];
      generationList.forEach((el) => {
        for (const reading of userScoreFireStore?.reading!) {
          if (el == reading) {
            geneReadingList.push(reading);
          }
        }

        for (const spelling of userScoreFireStore?.spelling!) {
          if (el == spelling) {
            geneSpellingList.push(spelling);
          }
        }

        for (const listen of userScoreFireStore?.listening!) {
          if (el == listen) {
            geneListeningList.push(listen);
          }
        }
      });

      let generationScore: generationScoreType = {
        generation: generation.name,
        count: generationCount,
        listening: geneListeningList,
        spelling: geneSpellingList,
        reading: geneReadingList,
      };
      scoreList.push(generationScore);
    }

    setGenerationScore(scoreList);
  };

  useEffect(() => {
    getUserScore();
  }, []);
  return (
    <Container>
      <Typography
        variant="h4"
        component="div"
        color="text.first"
        sx={{ textAlign: "center" }}
      >
        {userInfo.userName}'s Score
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "550px", mx: "auto", mt: 2 }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell>Score</TableCell>
              <TableCell align="right">reading</TableCell>
              <TableCell align="right">spelling</TableCell>
              <TableCell align="right">listening</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generationScore?.map((data) => (
              <TableRow
                key={data.generation}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:first-of-type td, &:first-of-type th": { borderBottom: 1 },
                }}
              >
                <TableCell component="th" scope="row">
                  {data.generation}/{data.count}
                </TableCell>
                <TableCell align="right">{data.reading?.length}</TableCell>
                <TableCell align="right">{data.spelling?.length}</TableCell>
                <TableCell align="right">{data.listening?.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
