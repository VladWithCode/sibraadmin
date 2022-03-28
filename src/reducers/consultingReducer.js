import { redTypes } from '../types/reduxTypes';

export const consultingReducer = (state = [], action) => {
  switch (action.type) {
    case redTypes.getProjects:
      return action.payload;

    case redTypes.projectsSet:
      return action.payload;

    default:
      return state;
  }
};

export const consultingLotsReducer = (state = [], action) => {
  switch (action.type) {
    case redTypes.getLots:
      return action.payload;

    default:
      return state;
  }
};

export const consultingClients = (state = [], action) => {
  switch (action.type) {
    case redTypes.getClients:
      return action.payload;

    default:
      return state;
  }
};
