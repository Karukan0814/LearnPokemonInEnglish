import { useEffect, useState, memo, useCallback } from "react";
import { useGenerateQuestions } from "../../hooks/useGenerateQuestions";
import { Answer } from "../organism/Answer";
import { PokemonDetail } from "../../types/Pokemon";
import { SoundButton } from "../atoms/SoundButton";
import { SelectGeneration } from "../atoms/SelectGeneration";
import { useAuth } from "../../hooks/useAuth";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/material";
import { ChoiceListImg } from "../molecules/ChoiceListImg";
import { ChoiceData } from "../../types/AnswerInfo";
import { useLocation } from "react-router-dom";
import { useFireStore } from "../../hooks/useFireStore";
import { SinmpleDialog } from "../atoms/SimpleDialog";

export const GameListenName = memo(() => {
  const { generatequestionList } = useGenerateQuestions();
  const { checkLogin } = useAuth();

  const choiceNum = 3; //選択肢の数を指定

  const [choiceList, setChoiceList] = useState<ChoiceData[]>([]);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [correctPokedetail, setCorrectPokedetail] = useState<PokemonDetail>();
  const [correcrFlag, setCorrecrFlag] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [generation, setGeneration] = useState("");
  const [correctIdList, setCorrectIdList] = useState<Array<string>>([]);

  const getChoiceList = useCallback(async () => {
    let ans = correctNum();

    let generatedChoicelist: ChoiceData[] = [];
    const pokeDetails = await generatequestionList(choiceNum, generation);

    let i = 0;

    for (let poke of pokeDetails) {
      generatedChoicelist.push({
        id: poke.id,
        name: poke.name,
        picture: poke.sprites.front_default,
        answer: i === ans ? true : false,
      });
      i++;
    }

    setCorrectPokedetail(pokeDetails[ans]);
    setChoiceList(generatedChoicelist);
  }, [choiceNum, generation]);

  const correctNum = () => {
    return Math.floor(Math.random() * choiceNum);
  };

  const handleOnClickImg = (choice: ChoiceData) => {
    setAnswerOpen(true);
    if (choice.answer) {
      setCorrecrFlag(true);
      setCorrectCount(correctCount + 1);
      const newCorrectIdList = [...correctIdList];
      newCorrectIdList.push(choice.id);
      setCorrectIdList(newCorrectIdList);
    } else {
      setCorrecrFlag(false);
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    setGeneration(event.target.value as string);
    handleReset();
  };
  const handleOnCloseModal = useCallback(() => {
    setAnswerOpen(false);
    setAnswerCount(answerCount + 1);
  }, [answerOpen, answerCount]);

  const handleReset = () => {
    setAnswerCount(0);
    setCorrectCount(0);
  };

  const [dialogText, setDialogText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  useEffect(() => {
    //ログイン情報の確認
    checkLogin();
    getChoiceList(); //選択肢となるポケモンのIDリストを取得
  }, [answerCount, generation]);

  const { saveScore, getScore } = useFireStore();
  const saveUserScore = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const userScore = await getScore();
    let mergedList = [...correctIdList];
    if (userScore?.listening) {
      mergedList = Array.from(
        new Set(correctIdList.concat(userScore?.listening))
      );
    }

    if (mergedList.length > 0) {
      try {
        await saveScore("listening", "", mergedList);
        setDialogText("Your score has been saved successfully");
        setOpenDialog(true);
      } catch {
        setDialogText("Sorry! Something wrong!");
        setOpenDialog(true);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <SelectGeneration generation={generation} handleChange={handleChange} />
        <Box>
          {correctCount}/{answerCount}{" "}
          <Button onClick={handleReset}>reset</Button>
          <Button onClick={saveUserScore}>save score</Button>
          <SinmpleDialog
            text={dialogText}
            handleClose={handleCloseDialog}
            open={openDialog}
          />
        </Box>
      </Box>
      <Box
        textAlign="center"
        sx={{
          display: "flex",
          mx: "auto",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="div"
            color="text.first"
            sx={{ textAlign: "center" }}
          >
            Which pokemon is called?
          </Typography>
          <SoundButton text={choiceList.find((chice) => chice.answer)?.name!} />
        </Box>

        <ChoiceListImg
          choiceList={choiceList}
          handleOnClickImg={handleOnClickImg}
        />
        <Answer
          correctFlag={correcrFlag}
          correctPokedetail={correctPokedetail}
          open={answerOpen}
          handleClose={handleOnCloseModal}
        />
      </Box>
    </Container>
  );
});
