import makeServerRequest from '../helpers/makeServerRequest';
import { redTypes } from '../types/reduxTypes';

export const recordsSet = records => ({
  type: redTypes.recordsSet,
  payload: records,
});

export const recordSet = record => ({
  type: redTypes.recordSet,
  payload: record,
});

export const recordUnset = () => ({
  type: redTypes.recordUnset,
});

export const recordsUpdate = () => {
  return async dispatch => {
    const { status, records, message, error } = await makeServerRequest(
      '/records'
    );

    if (status !== 'OK') {
      console.log(error);
      dispatch(
        message || error?.message || 'Error al actualizar los expedientes'
      );
      return;
    }

    dispatch(recordsSet(records));
  };
};
