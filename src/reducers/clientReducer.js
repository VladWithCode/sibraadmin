import { redTypes } from "../types/reduxTypes";




export const clientReducer = (state = {}, action) => {

    switch (action.type) {
        case redTypes.clientSet:
            return action.payload;

        default:
            return state;
    }

}