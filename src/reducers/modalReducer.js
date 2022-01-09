import { redTypes } from "../types/reduxTypes";

const initialState = {
  active: false,
  beenClosed: false,
  title: "",
  text: "",
  link: "",
  okMsg: "",
  closeMsg: "",
  input: null,
  input2: null,
  type: null,
  resetClient: false,
};

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case redTypes.modalUpdate:
      return {
        ...state,
        title: action.payload.title,
        text: action.payload.text,
        link: action.payload.link,
        okMsg: action.payload.okMsg,
        closeMsg: action.payload.closeMsg,
        input: action.payload.input,
        input2: action.payload.input2,
        type: action.payload.type,
        resetClient: action.payload.resetClient
          ? action.payload.resetClient
          : false,
      };

    case redTypes.modalEnable:
      return {
        ...state,
        active: true,
      };

    case redTypes.modalDisable:
      return {
        ...state,
        active: false,
        beenClosed: true,
      };

    case redTypes.modalSetInput:
      return {
        ...state,
        input: action.payload.input,
      };

    case redTypes.modalSetInput2:
      return {
        ...state,
        input2: action.payload.input2,
      };

    case redTypes.modalReset:
      return initialState;

    default:
      return state;
  }
};
