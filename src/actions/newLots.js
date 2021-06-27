
import { redTypes } from "../types/reduxTypes";



export const newLotsSet = newLots => ({
    type: redTypes.newLotsSet,
    payload: newLots
});

