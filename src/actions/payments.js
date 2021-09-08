import { redTypes } from "../types/reduxTypes";




export const buyLotSet = payment => ({
    type: redTypes.buyLotSet,
    payload: payment
})

export const buyLotReset = () => ({
    type: redTypes.buyLotReset
})

export const buyLotSetExtraCharges = extraCharges => ({
    type: redTypes.buyLotSetExtraCharges,
    payload: extraCharges
})