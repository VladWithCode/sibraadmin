import { redTypes } from '../types/reduxTypes';

export const authSet = isAuth => ({
  type: redTypes.authSet,
  payload: isAuth,
});

export const userSet = user => ({
  type: redTypes.userSet,
  payload: user,
});

export const roleSet = role => ({
  type: redTypes.roleSet,
  payload: role,
});
