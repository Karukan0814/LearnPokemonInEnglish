import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { useFireStore } from "./useFireStore";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userState } from "../store/userState";
import { UserInfo } from "../types/UserInfo";

export const useAuth = () => {
  const navigate = useNavigate();
  const { createFirstUserData } = useFireStore();
  const [userInfo, setUserInfo] = useRecoilState(userState); //recoilにユーザー情報をもたせる

  const signUpWithEmail = (
    displayName: string,
    email: string,
    password: string
  ) => {
    const result = createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //ユーザー作成が成功したら
        if (auth.currentUser) {
          //recoilにログインユーザー情報を持たせる
          const userInfo: UserInfo = {
            userId: userCredential.user.uid,
          };
          setUserInfo(userInfo);

          //firestoreにfavoriteslist+scoreの入れ物を作成
          createFirstUserData(userCredential.user.uid);

          //作成したユーザーに表示名とアイコンフォトを登録
          updateProfile(auth.currentUser, {
            displayName: displayName,
            photoURL: "",
          })
            .then(() => {
              //recoilにログインユーザー情報を持たせる
              const userInfo: UserInfo = {
                userId: userCredential.user.uid,
                userName: displayName,
              };
              setUserInfo(userInfo);

              //pokedex画面に遷移
              navigate("/pokedex");
              return true;
            })
            .catch((error) => {
              const errorMessage = error.message;
              alert(errorMessage);
              return false;
            });
        }
        return false;
      })
      .catch((error) => {
        const errorMessage = error.message;
        return false;
      });
    return result;
  };

  const signInWithEmail = (email: string, password: string) => {
    const result = signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //recoilにログインユーザー情報を持たせる
        setUserInfo({
          userId: userCredential.user.uid,
          userName: userCredential.user.displayName
            ? userCredential.user.displayName
            : "",
        });

        //pokedex画面に遷移
        navigate("/pokedex");
        return true;
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
        return false;
      });
    return result;
  };
  const signInGoogle = () => {
    const result = signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        //recoilにログインユーザー情報を持たせる
        setUserInfo({
          userId: userCredential.user.uid,
          userName: userCredential.user.displayName
            ? userCredential.user.displayName
            : "",
        });

        const isNewUser = getAdditionalUserInfo(userCredential)?.isNewUser;

        if (isNewUser) {
          //初回ログインの場合、favoriteリストをfirestoreに登録しておく
          createFirstUserData(userCredential.user.uid);
        }

        //pokedex画面に遷移
        navigate("/pokedex");
        return true;
      })
      .catch((error) => {
        const errorMessage = error.message;
        return false;
      });
    return result;
  };

  const updateUserData = (displayName?: string, photoURL?: string) => {
    //ユーザー管理画面にてユーザー情報変更
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL,
      })
        .then(() => {
          console.log("Profile updated!");
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    }
  };

  const resetRecoil = useResetRecoilState(userState);
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        //recoilからユーザー情報を削除

        resetRecoil();

        //localStorageからログインユーザー情報を削除
        localStorage.removeItem("recoil-persist");

        //localStorageからページ制御情報を削除
        localStorage.removeItem("pageInfo");

        // useResetRecoilState(userState);
        navigate("/"); //Top画面に移動
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  const checkLogin = () => {
    if (!userInfo.userId) {
      navigate("/"); //Top画面に移動
    }
  };

  const resetPassword = (email: string) => {
    //パスワードリセットメールを送信

    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          alert("Password reset email sent!");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        });
    } else {
      alert("email address is invalid.");
    }
  };
  return {
    signUpWithEmail,
    signInWithEmail,
    signOutUser,
    signInGoogle,
    updateUserData,
    checkLogin,
    resetPassword,
  };
};
