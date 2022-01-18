import { redTypes } from '../types/reduxTypes';

const initialState = {
  amount: '',
  type: '',
  markAsNextPayment: false,
  prorogateTo: '',
  editTemplate: false,
  prorogate: false,
  templates: [],
  date: '',
  amount1: '',
};

export const payments = (state = initialState, action) => {
  switch (action.type) {
    case redTypes.paymentSetInfo:
      return {
        ...state,
        ...action.payload,
      };

    case redTypes.extraPaymentSetInfo:
      return {
        ...state,
        amount1: action.payload.amount1,
        date: action.payload.date,
      };

    case redTypes.paymentsGetTemplates:
      return {
        ...state,
        templates: action.payload,
      };

    case redTypes.paymentRestart:
      return {
        ...initialState,
        templates: action.payload,
      };

    case redTypes.paymentTemplateSet:
      const current = state.templates.find(t => t._id === action.payload._id);

      current.state = action.payload.state;

      return {
        ...state,
      };

    default:
      return state;
  }
};
