import React from "react";
import { ChoiceData } from "../../types/AnswerInfo";

type Props = {
  choiceList: ChoiceData[];
  handleOnClickImg: (choice: ChoiceData) => void;
};

export const ChoiceListImg = (props: Props) => {
  const { choiceList, handleOnClickImg } = props;
  return (
    <div
      style={{
        display: "flex",

        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {choiceList.map((choice) => {
        return (
          <div
            key={choice.id}
            style={{
              margin: "15px",

              height: "200px",
              width: "200px",
              borderRadius: "4px",
              boxShadow:
                "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
              transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            }}
            onClick={() => handleOnClickImg(choice)}
          >
            <img
              style={{
                height: "200px",
                width: "200px",
                objectFit: "contain",
              }}
              src={choice.picture}
              alt={choice.name}
            />
          </div>
        );
      })}
    </div>
  );
};
