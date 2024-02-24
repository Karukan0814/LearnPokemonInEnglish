export type FavoriteListFromFirestore = {
  favoriteIdList: Array<string>;
};

export type UserScoreFromFirestore = {
  level: string;

  reading: Array<string>;
  spelling: Array<string>;
  listening: Array<string>;
};
