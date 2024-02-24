import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRecoilValue } from "recoil";
import { userState } from "../store/userState";
import {
  FavoriteListFromFirestore,
  UserScoreFromFirestore,
} from "../types/FirestoreData";

export const useFireStore = () => {
  const userInfo = useRecoilValue(userState);

  const createFirstUserData = async (userId: string) => {
    //初回ユーザー登録時にfavoritesListの入れ物を作成しておく

    const favdocRef = doc(db, "favorites", userId);

    await setDoc(favdocRef, {
      favoriteIdList: [],
    });

    const scoredocRef = doc(db, "score", userId);

    await setDoc(scoredocRef, {
      level: "マサラタウン",
      reading: [],
      spelling: [],
      listening: [],
    });
  };
  const saveFavorite = async (id: string, removeFlag: boolean) => {
    const favoritesRef = doc(db, "favorites", userInfo.userId).withConverter(
      favoriteConverter
    );
    if (removeFlag) {
      // favoriteIdListから指定のIDを削除

      await updateDoc(favoritesRef, {
        favoriteIdList: arrayRemove(id),
      });
    } else {
      // favoriteIdListに指定のIDを追加

      await updateDoc(favoritesRef, {
        favoriteIdList: arrayUnion(id),
      });
    }
  };

  const getFavoriteList = async () => {
    const favoriteRef = doc(db, "favorites", userInfo.userId).withConverter(
      favoriteConverter
    );

    const docSnap = await getDoc(favoriteRef);

    if (docSnap.exists()) {
      return docSnap.data().favoriteIdList;
    } else {
      // doc.data() will be undefined in this case
      // alert("Sorry! I couldn't get your favoriteList");
      //初回ログイン時はpokedex表示時にfirestoreへの登録が間に合っていない場合があるので、空配列を返す。
      const emptyList: string[] = [];
      return emptyList;
    }
  };

  const saveScore = async (
    subject: string,
    level: string,
    correctIdList: string[]
  ) => {
    const userScoreRef = doc(db, "score", userInfo.userId).withConverter(
      scoreConverter
    );
    // scoreを更新
    if (subject == "reading") {
      await updateDoc(userScoreRef, {
        reading: correctIdList,
      });
    } else if (subject == "spelling") {
      await updateDoc(userScoreRef, {
        spelling: correctIdList,
      });
    } else if (subject == "listening") {
      await updateDoc(userScoreRef, {
        listening: correctIdList,
      });
    }
  };
  const getScore = async () => {
    const userScoreRef = doc(db, "score", userInfo.userId).withConverter(
      scoreConverter
    );

    const docSnap = await getDoc(userScoreRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // // doc.data() will be undefined in this case
      // alert("Sorry! I couldn't get your scoreData");
      //初回ログイン時はpokedex表示時にfirestoreへの登録が間に合っていない場合がある
      return null;
    }
  };

  const favoriteConverter = {
    toFirestore: (favoriteData: FavoriteListFromFirestore) => {
      return {
        favoriteIdList: favoriteData.favoriteIdList,
      };
    },
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<FavoriteListFromFirestore>,
      option: SnapshotOptions
    ) => {
      const data = snapshot.data(option);
      const returnData: FavoriteListFromFirestore = {
        favoriteIdList: data.favoriteIdList,
      };
      return returnData;
    },
  };
  const scoreConverter = {
    toFirestore: (scoreData: UserScoreFromFirestore) => {
      return {
        level: scoreData.level,

        reading: scoreData.reading,
        spelling: scoreData.spelling,
        listening: scoreData.listening,
      };
    },
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<UserScoreFromFirestore>,
      option: SnapshotOptions
    ) => {
      const data = snapshot.data(option);
      const returnData: UserScoreFromFirestore = {
        level: data.level,
        reading: data.reading,
        spelling: data.spelling,
        listening: data.listening,
      };
      return returnData;
    },
  };
  return {
    createFirstUserData,
    saveFavorite,
    getFavoriteList,
    saveScore,
    getScore,
  };
};
