import React from "react";
import { PokemonDetail } from "../types/Pokemon";
import { usePokeData } from "./usePokeData";

export const useGenerateQuestions = () => {
  const {
    fetchAllPokemonSpeciesList,
    fetchPokemonDetailWithCondition,
    fetchGenerationData,
  } = usePokeData();
  const generateIdList = async (choiceNum: number) => {
    const allSpeciesData = await fetchAllPokemonSpeciesList();

    const allCount = allSpeciesData.count;

    // 重複なしの数字の配列を作る
    let idList: number[] = [];
    for (let i = 0; i < choiceNum; i++) {
      while (true) {
        let randomId = Math.floor(Math.random() * (allCount - 1));
        if (!idList.includes(randomId)) {
          idList.push(randomId);
          break;
        }
      }
    }
    return idList;
  };

  const generatequestionList = async (
    choiceNum: number,
    generation?: string
  ) => {
    let pokeList: Array<string | number> = [];

    if (generation && generation != "0") {
      pokeList = await generateEachGenerationsNameList(choiceNum, generation);
    } else {
      pokeList = await generateIdList(choiceNum);
    }
    //各IDのdetailDataを取得

    const promiseChain = Promise.resolve()
      .then(function () {
        let promises = [];

        let i = 0;
        for (const id of pokeList) {
          promises.push(fetchPokemonDetailWithCondition(id.toString()));
        }
        return Promise.all(promises);
      })
      .then(function (detailsList) {
        return detailsList;
      });

    return promiseChain;
  };

  const generateEachGenerationsNameList = async (
    choiceNum: number,
    generationNum: string
  ) => {
    const generationData = await fetchGenerationData(generationNum);

    const speciesList = generationData.pokemon_species;
    const nameList: string[] = [];

    for (let i = 0; i < choiceNum; i++) {
      while (true) {
        let randomId = Math.floor(Math.random() * speciesList.length + 0);
        if (!nameList.includes(speciesList[randomId].name)) {
          nameList.push(speciesList[randomId].name);
          break;
        }
      }
    }

    return nameList;
  };

  return { generatequestionList };
};
