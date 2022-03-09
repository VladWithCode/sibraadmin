import { redTypes } from '../types/reduxTypes';

export const recordSet = record => ({
  type: redTypes.recordSet,
  payload: record,
});

export const recordUnset = () => ({
  type: redTypes.recordUnset,
});
