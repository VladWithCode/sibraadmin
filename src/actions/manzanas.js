import { redTypes } from "../types/reduxTypes";



export const manzanasSet = manzanas => ({
    type: redTypes.manzanasSet,
    payload: manzanas
})