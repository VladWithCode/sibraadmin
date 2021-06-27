import { redTypes } from "../types/reduxTypes";


const initialState = {};

export const manzanasReducer = (state = initialState, action) => {
    switch (action.type) {
        case redTypes.manzanasSet:
            return [...action.payload];
    
        default:
            return state;
    }
}