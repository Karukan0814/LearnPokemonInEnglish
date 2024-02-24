import { useState, memo, useCallback } from "react";
/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Signin } from "../organism/Signin";
import { PrimaryButton } from "../atoms/PrimaryButton";

export const Top = memo(() => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), [open]);
  const handleClose = useCallback(() => setOpen(false), [open]);

  return (
    <div>
      <Sheader>
        <SheaderContent>
          <SheaderTitle>What's this Pokemon's name?</SheaderTitle>
          <PrimaryButton text="Start" onClick={handleOpen} />
        </SheaderContent>
      </Sheader>
      {/* <div className="container">
        <div className="concept">
          <h2>そのポケモン、英語でなんていうか知ってる？</h2>
          <p>
            いまやポケモンは世界中にユーザーがいる。今やポケモンを知っている＝正解中のポケモントレーナーとお友達になれる！
            <br />
            だけど・・・そのポケモン、英語でなんていうか知っている？
            例えばヤミラミ。英語ではSableye。どうやって読みますか？
            ちなみに私は米国人相手に　サブリーアイ　と呼んで無事に爆死しました。
            セィブルアーイ　って読むんですね。
            <br />
            こんなんじゃ世界中のポケモントレーナーとお友達になれない！！！
            <br />
            ポケモンの英語名、そして読み方を覚えなければ！
            そんな気持ちでこのサイトを作りました。
          </p>
        </div>
        <div className="content">
          <h2>できること</h2>
          <p>
            このサイトでは、日本語名・英語名が両方記載＋どのように発音するか確認できる。
            <br />
            さらには各種ポケモンの英語名を当てるミニゲームで遊べます。楽しく遊んでそのポケモンが英語でなんていうのか学んじゃおう！
          </p>
        </div>
      </div> */}

      <Signin open={open} handleClose={handleClose} />
    </div>
  );
});

const Sheader = styled.header`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-image: url(/img/toppageIMG.jpg);
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  padding: 20px 40px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SheaderContent = styled.div`
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
`;
const SheaderTitle = styled.h1`
  color: #000066;
  text-shadow: 1px 2px 3px #808080;
  margin: 60px auto;
`;
