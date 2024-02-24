import { useEffect, useState, memo, useCallback } from "react";
import { PokemonDetail } from "../../types/Pokemon";
import { Answer } from "../organism/Answer";
import { useGenerateQuestions } from "../../hooks/useGenerateQuestions";
import { SelectGeneration } from "../atoms/SelectGeneration";
import { useAuth } from "../../hooks/useAuth";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { SelectChangeEvent } from "@mui/material/Select";
import { InputText } from "../atoms/InputText";
import { Box } from "@mui/material";
import { useFireStore } from "../../hooks/useFireStore";
import { SinmpleDialog } from "../atoms/SimpleDialog";

export const GameSpellName = memo(() => {
  const { generatequestionList } = useGenerateQuestions();
  const { checkLogin } = useAuth();
  const choiceNum = 1; //選択肢の数を指定

  const [answerOpen, setAnswerOpen] = useState(false);
  const [questionPokeDetail, setQuestionPokeDetail] = useState<PokemonDetail>();
  const [correcrFlag, setCorrecrFlag] = useState(false);
  const [answerCount, setAnswerCount] = useState(0); //出題数
  const [correctCount, setCorrectCount] = useState(0); //正答数
  const [correctIdList, setCorrectIdList] = useState<Array<string>>([]);
  const [generation, setGeneration] = useState("");
  const handleOnCloseModal = useCallback(() => {
    setAnswerOpen(false);

    setAnswerCount(answerCount + 1);
  }, [answerOpen, answerCount]);
  const handleReset = useCallback(() => {
    setAnswerCount(0);
    setCorrectCount(0);
  }, []);

  const handleCheckAnswer = (condition?: string) => {
    //入力されたtextの答え合わせ
    if (condition?.toLowerCase() == questionPokeDetail?.name) {
      setCorrecrFlag(true);

      setCorrectCount(correctCount + 1);

      const newCorrectIdList = [...correctIdList];
      newCorrectIdList.push(questionPokeDetail!.id);
      setCorrectIdList(newCorrectIdList);
    } else {
      setCorrecrFlag(false);
    }

    setAnswerOpen(true); //解答を表示
  };

  const generateQuestion = useCallback(async () => {
    const pokeDetails = await generatequestionList(choiceNum, generation);

    setQuestionPokeDetail(pokeDetails[0]);
  }, [choiceNum, generation]);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setGeneration(event.target.value as string);
    handleReset();
  }, []);

  const { saveScore, getScore } = useFireStore();
  const saveUserScore = async () => {
    const userScore = await getScore();
    let mergedList = [...correctIdList];
    if (userScore?.spelling) {
      mergedList = Array.from(
        new Set(correctIdList.concat(userScore?.spelling))
      );
    }

    if (mergedList.length > 0) {
      try {
        await saveScore("spelling", "", mergedList);
        setDialogText("Your score has been saved successfully");
        setOpenDialog(true);
      } catch {
        setDialogText("Sorry! Something wrong!");
        setOpenDialog(true);
      }
    }
  };

  const [dialogText, setDialogText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  useEffect(() => {
    //ログイン情報の確認
    checkLogin();
    generateQuestion();
  }, [answerCount, generation]);
  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <SelectGeneration generation={generation} handleChange={handleChange} />
        <Box>
          {correctCount}/{answerCount}{" "}
          <Button onClick={handleReset}>reset</Button>
          <Button onClick={saveUserScore}> save score</Button>
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
        <Typography
          variant="h4"
          component="div"
          color="text.first"
          sx={{ textAlign: "center" }}
        >
          Spell this Pokemon's name.
        </Typography>

        <Container>
          <InputText
            label=""
            iconName="send"
            onClickEvent={handleCheckAnswer}
          />
          <Card
            key={questionPokeDetail?.id}
            sx={{
              mx: "auto",
              my: 2,
              width: "300px",
              height: "300px",
            }}
          >
            <CardMedia
              component="img"
              image={questionPokeDetail?.sprites.front_default}
              alt={questionPokeDetail?.id}
            />
          </Card>
        </Container>
        <Answer
          correctFlag={correcrFlag}
          correctPokedetail={questionPokeDetail}
          open={answerOpen}
          handleClose={handleOnCloseModal}
        />
      </Box>
    </Container>
  );
});
