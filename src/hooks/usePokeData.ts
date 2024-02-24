import React from "react";
import { generationSet } from "../common/define";
import {
  Pokemon,
  PokemonList,
  PokemonDetail,
  PokemonSpecies,
  AllPokeSpeciesList,
  Generation,
} from "../types/Pokemon";

export const usePokeData = () => {
  const basicUrl = "https://pokeapi.co/api/v2/";
  const fetchUrls = {
    fetchPokemonData: `${basicUrl}pokemon/`,
  };

  const fetchPokemonList = (
    offset: number = 0,
    limit: number = 20
  ): Promise<PokemonList> => {
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

    return fetcher<PokemonList>(url);
  };

  const fetchPokemonDetailWithCondition = (condition?: string) => {
    return fetcher<PokemonDetail>(
      `https://pokeapi.co/api/v2/pokemon/${condition}`
    );
  };
  const fetchPokemonSpeciesWithCondition = (condition?: string) => {
    return fetcher<PokemonSpecies>(
      `https://pokeapi.co/api/v2/pokemon-species/${condition}`
    );
  };

  const fetchAllPokemonSpeciesList = () => {
    return fetcher<AllPokeSpeciesList>(
      `https://pokeapi.co/api/v2/pokemon-species/`
    );
  };

  const fetchGenerationData = (condition?: string) => {
    return fetcher<Generation>(
      `https://pokeapi.co/api/v2/generation/${condition}`
    );
  };

  const fetchEachGenerationPokeList = async (generationId: string) => {
    const generationObj = generationSet.find((generation) => {
      return generation.id === generationId;
    });

    if (generationObj) {
      const promiseChain = Promise.resolve()

        .then(function () {
          let idList = generationObj.idList;
          console.log("idList", idList);
          let detailsPromises = [];
          for (const id of idList) {
            detailsPromises.push(
              fetchPokemonDetailWithCondition(id.toString())
            );
          }

          return Promise.all(detailsPromises);
        })
        .then(function (detailsList) {
          return detailsList;
        });

      return promiseChain;
    }
  };
  const fetchAnyPokeDataFromUrl = <T>(url: string) => {
    return fetcher<T>(url);
  };
  const fetcher = <T>(requestUrl: string): Promise<T> => {
    return new Promise((resolve, reject) => {
      fetch(requestUrl)
        .then((response) => {
          if (response.ok) {
            response
              .json()
              .then((json) => resolve(json))
              .catch((err) => reject(err));
          } else {
            reject(response);
          }
        })
        .catch((err) => reject(err));
      return true; //cross-origin request issue対策
    });
  };

  return {
    fetchPokemonList,
    fetchPokemonDetailWithCondition,
    fetchAnyPokeDataFromUrl,
    fetchPokemonSpeciesWithCondition,
    fetchAllPokemonSpeciesList,
    fetchGenerationData,
    fetchEachGenerationPokeList,
  };
};
