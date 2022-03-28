import { redTypes } from '../types/reduxTypes';

export const statsSet = stats => ({ type: redTypes.statsSet, payload: stats });
