import { redTypes } from "../types/reduxTypes";



export const newLotsReducer = (state = [], action) => {

    switch (action.type) {

        case redTypes.newLotsSet:
            return [...action.payload];

        default:
            return state;
    }

}