import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSet, roleSet, userSet } from '../actions/auth';
import { setTempError } from '../actions/ui';
import makeServerRequest from '../helpers/makeServerRequest';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuth, user, role } = useSelector(state => state.auth);

  useEffect(() => {
    makeServerRequest('/auth/check').then(({ auth, message }) => {
      if (message) dispatch(setTempError(message));
      else dispatch(authSet(!!auth));
    });
  }, []);

  useEffect(() => {
    if (isAuth) {
      makeServerRequest('/user/current').then(({ status, user, message }) => {
        if (status !== 'OK') dispatch(setTempError(message));
        else {
          dispatch(userSet(user));
          dispatch(roleSet(user.role));
        }
      });
    } else {
      dispatch(userSet(null));
      dispatch(roleSet(null));
    }
  }, [isAuth]);

  return { isAuth, user, role };
};
