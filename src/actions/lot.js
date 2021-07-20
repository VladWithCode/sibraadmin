import { redTypes } from "../types/reduxTypes";


export const setLot = lot => ({
    type: redTypes.setLot,
    payload: lot
})