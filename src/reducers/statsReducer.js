import { redTypes } from '../types/reduxTypes';

const initialState = {};

export const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case redTypes.statsSet:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
