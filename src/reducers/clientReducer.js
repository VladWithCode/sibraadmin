import { redTypes } from "../types/reduxTypes";

const initialState = {
  names: "",
  patLastname: "",
  matLastname: "",
  _id: "",
  curp: "",
  maritalState: "",
  occupation: "",
  township: "",
  state: "",
  pob: "",
  dob: "",
  nationality: "",
  email: "",
  phoneNumber: "",
  col: "",
  street: "",
  zip: "",
  extNumber: "",
  intNumber: "",
  refs: [
    {
      names: "",
      patLastname: "",
      matLastname: "",
      email: "",
      phoneNumber: "",
      col: "",
      street: "",
      zip: "",
      extNumber: "",
      intNumber: "",
    },
  ],
  address: "",
};

export const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case redTypes.clientSet:
      return action.payload;

    case redTypes.clientReset:
      return initialState;

    default:
      return state;
  }
};
