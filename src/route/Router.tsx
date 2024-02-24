import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import { ErrorPage } from "../components/pages/ErrorPage";
import { GameListenName } from "../components/pages/GameListenName";
import { GameSpellName } from "../components/pages/GameSpellName";
import { GameWhatName } from "../components/pages/GameWhatName";
import { Pokedex } from "../components/pages/Pokedex";
import { PokedexGeneration } from "../components/pages/PokedexGeneration";
import { PokemonDetailedInfo } from "../components/pages/PokemonDetailedInfo";
import { Score } from "../components/pages/Score";
import { Setting } from "../components/pages/Setting";
import { Top } from "../components/pages/Top";
import { HeaderLayout } from "../components/templates/HeaderLayout";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route errorElement={<ErrorPage />}>
          <Route path="/" element={<Top />} />

          <Route
            path="pokedex"
            element={
              <HeaderLayout>
                <Pokedex />
              </HeaderLayout>
            }
          />

          <Route
            path="pokedex/:id"
            element={
              <HeaderLayout>
                <PokemonDetailedInfo />
              </HeaderLayout>
            }
          />
          <Route
            path="pokedex/generation/:generationId"
            element={
              <HeaderLayout>
                <PokedexGeneration />
              </HeaderLayout>
            }
          />

          <Route
            path="games/reading"
            element={
              <HeaderLayout>
                <GameWhatName />
              </HeaderLayout>
            }
          ></Route>
          <Route
            path="games/spelling"
            element={
              <HeaderLayout>
                <GameSpellName />
              </HeaderLayout>
            }
          ></Route>
          <Route
            path="games/listening"
            element={
              <HeaderLayout>
                <GameListenName />
              </HeaderLayout>
            }
          ></Route>
          <Route
            path="score"
            element={
              <HeaderLayout>
                <Score />
              </HeaderLayout>
            }
          />
          <Route path="setting" element={<Setting />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};
