import { redTypes } from "../types/reduxTypes";


const initialState = {
    lot: {
        record: {}
    },
    record: {

        _id: '',

        paymentInfo: {
            lapseType: '',
            minimumPaymentAmount: '',
            lapseToPay: '',
            paymentsDay: '',
        },

        payments: [],
        extraCharges: [],
        extraChargesUpdated: [],
        invalidPayments: [],
        invalidExtraPayments: []
    }
}



export const historyActionsReducer = (state = initialState, action) => {

    switch (action.type) {
        case redTypes.historySetLot:
            return {
                ...state,
                lot: action.payload
            };

        case redTypes.historySetRecordInfo:
            return {
                ...state,
                record: {
                    ...state.record,
                    ...action.payload,
                    payments: action.payload.payments.map(p => ({
                        ...p,
                        valid: true,
                        deletePayment: false
                    }))
                }
            }

        case redTypes.historySetPayment:

            const payment = action.payload;

            payment.valid = (payment.payedAt !== '' && payment.amount !== '');

            if (!payment.valid && !payment.delete) {

                if (!state.record.invalidPayments.includes(payment._id)) {
                    state.record.invalidPayments.push(payment._id);
                }

            } else if ((payment.valid && !payment.delete) || payment.delete) {

                let index = state.record.invalidPayments.indexOf(payment._id);

                if (index !== (-1)) {
                    state.record.invalidPayments.splice(index, 1);
                }

            }

            const index = state.record.payments.findIndex(p => p._id === payment._id);

            state.record.payments.splice(index, 1, payment);

            return {
                ...state
            }

        case redTypes.historySetExtraPayment:

            const extraPayment = action.payload;
            const extraCharge = state.record.extraCharges.find(e => e._id === action.payload.extraChargeId);

            if (!state.record.extraChargesUpdated.includes(extraCharge._id)) {
                state.record.extraChargesUpdated.push(extraCharge._id)
            }

            extraPayment.valid = (extraPayment.date !== '' && extraPayment.amount !== '');

            const tempInvalidExtraPayments = state.record.invalidExtraPayments.find(i => i.extraChargeId === extraCharge._id)

            if (!extraPayment.valid && !extraPayment.delete) {

                if (tempInvalidExtraPayments) {

                    if (!tempInvalidExtraPayments.invalidPayments.find(inp => inp._id === extraPayment._id)) {
                        tempInvalidExtraPayments.invalidPayments.push(extraPayment._id);
                    }


                } else (
                    state.record.invalidExtraPayments.push({
                        extraChargeId: extraCharge._id,
                        invalidPayments: [extraPayment._id]
                    })
                )

            } else if ((extraPayment.valid && !extraPayment.delete) || extraPayment.delete) {

                if (tempInvalidExtraPayments) {


                    let index = tempInvalidExtraPayments.invalidPayments.indexOf(extraPayment._id);

                    if (index !== (-1)) {
                        tempInvalidExtraPayments.invalidPayments.splice(index, 1);

                        let tempIndex = state.record.invalidExtraPayments.findIndex(iep => iep.extraChargeId === tempInvalidExtraPayments.extraChargeId);

                        if (tempIndex !== (-1)) {
                            state.record.invalidExtraPayments.splice(tempIndex, 1);
                        }

                    }

                }
            }

            const extraPaymentIndex = extraCharge.payments.findIndex(p => p._id === extraPayment._id);

            extraCharge.payments.splice(extraPaymentIndex, 1, extraPayment);

            return {
                ...state
            }

        case redTypes.historySetExtraPayBefore:

            const tempExtraCharge = state.record.extraCharges.find(e => e._id === action.payload.extraChargeId);

            tempExtraCharge.payBefore = action.payload.payBefore;

            return {
                ...state
            }

        default:
            return state;
    }

}