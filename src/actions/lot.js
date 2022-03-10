import { redTypes } from '../types/reduxTypes';
import { staticURL } from '../url';
import { uiFinishLoading, uiStartLoading } from './ui';

export const setLot = lot => ({
  type: redTypes.setLot,
  payload: lot,
});

export const getLot = id => {
  const url = `${staticURL}/lots/${id}`;

  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url)
      .then(res => res.json())
      .then(data => {
        dispatch(uiFinishLoading());
        return dispatch(setLot(data.lot));
      })
      .catch(err => console.log(err));
  };
};

export const lotSetBindings = bindings => ({
  type: redTypes.lotSetBindings,
  payload: bindings,
});

export const lotAddBinding = () => ({
  type: redTypes.lotAddBinding,
});

export const lotDeleteBinding = index => ({
  type: redTypes.lotDeleteBinding,
  payload: {
    index,
  },
});
