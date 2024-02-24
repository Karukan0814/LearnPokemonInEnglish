import { generationSet } from "./define";

export const inputValidator = () => {
  const error: { reason: string } = { reason: "" };
  const validateSearchGeneration = (generation?: string) => {
    if (!generation || !generationSet.find((set) => set.id === generation)) {
      error.reason = "generationId is not valid.";
      return error;
    }
  };
  return { validateSearchGeneration };
};
