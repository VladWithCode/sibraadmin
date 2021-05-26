import { redTypes } from "../types/reduxTypes";




export const clientReducer = (state = {}, action) => {

    switch (action.type) {
        case redTypes.clientCreate:
            return {
                ...state,
                dispName: action.payload.dispName,
                clientId: action.payload.clientId
            }
    
        default:
            return state;
    }

}