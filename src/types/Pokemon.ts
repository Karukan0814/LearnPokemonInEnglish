export type PokemonList = {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
};

export type Pokemon = {
  name: string;
  url: string;
};

export type MergedPokemonDetail = PokemonDetail & PokemonSpecies;
export type PokemonDetail = {
  answer: boolean;
  id: string;
  name: string;
  order: number;
  sprites: {
    front_default: string;
    back_default: string;
    other: {
      "official-artwork": {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  types: [
    {
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }
  ];
  weight: number;
  height: number;
  abilities: [
    {
      ability: {
        name: string;
        url: string;
      };
    }
  ];
};

export type AllPokeSpeciesList = {
  count: number;
  next: string;
  previous: string;
  results: [
    {
      name: string;
      url: string;
    }
  ];
};

export type PokemonSpecies = {
  id: number;
  name: string;
  base_happiness: number;
  capture_rate: number;
  color: {
    name: string;
    url: string;
  };
  egg_groups: [
    {
      name: string;
      url: string;
    },
    {
      name: string;
      url: string;
    }
  ];
  evolution_chain: {
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  };
  flavor_text_entries: [
    {
      flavor_text: string;
      language: {
        name: string;
        url: string;
      };
      version: {
        name: string;
        url: string;
      };
    }
  ];
  form_descriptions: [];
  forms_switchable: boolean;
  gender_rate: number;
  genera: [
    {
      genus: string;
      language: {
        name: string;
        url: string;
      };
    }
  ];
  generation: {
    name: string;
    url: string;
  };
  growth_rate: {
    name: string;
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  };
  has_gender_differences: boolean;
  hatch_counter: number;

  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;

  names: [
    {
      language: {
        name: string;
        url: string;
      };
      name: string;
    }
  ];
  order: number;
  pal_park_encounters: [
    {
      area: {
        name: string;
        url: string;
      };
      base_score: number;
      rate: number;
    }
  ];
  pokedex_numbers: [
    {
      entry_number: number;
      pokedex: {
        name: string;
        url: string;
      };
    }
  ];
  shape: {
    name: string;
    url: string;
  };
  varieties: [
    {
      is_default: boolean;
      pokemon: {
        name: string;
        url: string;
      };
    }
  ];
};

export type EvolutionChain = {
  baby_trigger_item: string;
  chain: {
    evolution_details: [EvolutionDetails];
    evolves_to: [EvolvesTo];
    is_baby: boolean;
    species: {
      name: string;
      url: string;
    };
  };
  id: string;
};
type EvolutionDetails = {
  gender: string;
  held_item: string;
  item: string;
  known_move: string;
  known_move_type: string;
  location: string;
  min_affection: string;
  min_beauty: string;
  min_happiness: string;
  min_level: string;
  needs_overworld_rain: string;
  party_species: string;
  party_type: string;
  relative_physical_stats: string;
  time_of_day: string;
  trade_species: string;
  trigger: {
    name: string;
    url: string;
  };
  turn_upside_down: boolean;
};

type EvolvesTo = {
  evolution_details: [EvolutionDetails];
  evolves_to: [EvolvesTo];
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
};

export type Generation = {
  id: number;
  main_region: {
    name: string;
    url: string;
  };

  pokemon_species: [
    {
      name: string;
      url: string;
    }
  ];
  types: [
    {
      name: string;
      url: string;
    }
  ];
  version_groups: [
    {
      name: string;
      url: string;
    }
  ];
};
