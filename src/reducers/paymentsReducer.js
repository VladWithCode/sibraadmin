import { redTypes } from "../types/reduxTypes";



const initialState = {

    customerId: '',
    lotId: '',
    projectId: '',
    state: '',

    depositAmount: '',
    lapseToPay: '',
    lapseType: '',
    lotPrice: '',
    minimumPaymentAmount: '',
    paymentsDate: '',
    recordOpenedAt: '',
    reservationDate: '',

    payments: [
        {
            amount: '',
            ogPaymentDate: '',
            payedAt: ''
        },
        {
            amount: '',
            payedAt: ''
        }

    ],

    amount: '',
    payedAt: '',
    payedTo: '',

    client: '',
    liquidate: false,
    history: false,

    extraCharges: [],

    emptyFields: []

}

export const paymentReducer = (state = initialState, action) => {

    switch (action.type) {
        case redTypes.buyLotSet:
            return {
                ...state,
                ...action.payload
            };

        case redTypes.buyLotReset:
            return {
                ...initialState,
                extraCharges: state.extraCharges
            }

        case redTypes.buyLotSetExtraCharges:
            return {
                ...state,
                extraCharges: action.payload
            }

        default:
            return state;
    }

}