import { redTypes } from '../types/reduxTypes';

const initialState = [];

export const recordsReducer = (state = initialState, action) => {
  switch (action.type) {
    case redTypes.recordsSet:
      return action.payload;

    default:
      return state;
  }
};

const initialRecordState = {};

export const recordReducer = (state = initialRecordState, action) => {
  switch (action.type) {
    case redTypes.recordSet:
      return action.payload;

    default:
      return state;
  }
};
