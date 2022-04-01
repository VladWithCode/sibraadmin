import { redTypes } from '../types/reduxTypes';

const initialState = {
  isAuth: false,
  user: null,
  role: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case redTypes.authSet:
      return { ...state, isAuth: action.payload };
    case redTypes.userSet:
      return { ...state, user: action.payload };
    case redTypes.roleSet:
      return { ...state, role: action.payload };
    default:
      return state;
  }
};
