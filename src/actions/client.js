import { redTypes } from "../types/reduxTypes";

export const clientSet = (client) => ({
  type: redTypes.clientSet,
  payload: client,
});

export const clientReset = () => ({
  type: redTypes.clientReset,
});
