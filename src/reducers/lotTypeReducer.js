import { redTypes } from '../types/reduxTypes';

const initialState = {
  active: false,
  beenClosed: false,
  lotTypes: [],
  modalConfirm: {},
};
export const lotTypesReducer = (state = initialState, action) => {
  switch (action.type) {
    case redTypes.lotTypesReset:
      return initialState;

    case redTypes.lotTypesSet:
      return {
        ...state,
        lotTypes: action.payload,
      };

    case redTypes.lotTypesCreate:
      const newList = state.lotTypes
        ? {
            ...state,
            lotTypes: [...state.lotTypes, action.payload],
          }
        : {
            ...state,
            lotTypes: [action.payload],
          };

      return newList;

    case redTypes.lotTypesEdit:
      const lotType = state.lotTypes.find(
        lot => lot.type === action.payload.type
      );

      lotType.pricePerM = action.payload.pricePerM
        ? action.payload.pricePerM
        : lotType.pricePerM;

      lotType.cornerPrice = action.payload.cornerPrice
        ? action.payload.cornerPrice
        : lotType.cornerPrice;

      lotType.sameArea = action.payload.sameArea
        ? action.payload.sameArea
        : lotType.sameArea;

      lotType.type = action.payload.newType
        ? action.payload.newType
        : lotType.type;

      lotType.area = action.payload.area ? action.payload.area : lotType.area;

      return state;

    case redTypes.lotTypesDelete:
      const newLotTypes = state.lotTypes.filter(
        lotType => lotType.type !== action.payload.type
      );

      if (newLotTypes.length > 0) {
        return {
          ...state,
          lotTypes: newLotTypes,
        };
      }

      return {
        ...state,
        lotTypes: [],
      };

    case redTypes.lotTypesModalEnable:
      return {
        ...state,
        active: true,
      };

    case redTypes.lotTypesModalDisable:
      return {
        ...state,
        active: false,
        beenClosed: true,
      };

    case redTypes.lotTypesModalConfirmReset:
      return {
        ...state,
        modalConfirm: {
          ...state.modalConfirm,
          active: false,
          beenClosed: false,
        },
      };

    case redTypes.lotTypesModalConfirmUpdate:
      return {
        ...state,
        modalConfirm: {
          ...state.modalConfirm,
          title: action.payload.title,
          text: action.payload.text,
          okMsg: action.payload.okMsg,
          closeMsg: action.payload.closeMsg,
          action: action.payload.action,
          type: action.payload.type,
        },
      };

    case redTypes.lotTypesModalConfirmEnable:
      return {
        ...state,
        modalConfirm: {
          ...state.modalConfirm,
          active: true,
        },
      };

    case redTypes.lotTypesModalConfirmDisable:
      return {
        ...state,
        modalConfirm: {
          ...state.modalConfirm,
          active: false,
          beenClosed: true,
        },
      };

    default:
      return state;
  }
};
