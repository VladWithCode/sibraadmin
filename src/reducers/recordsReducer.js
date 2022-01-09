import { redTypes } from "../types/reduxTypes";

const initialState = [];

export const recordReducer = (state = initialState, action) => {
  switch (action.type) {
    case redTypes.recordsSet:
      return action.payload;

    default:
      return state;
  }
};
