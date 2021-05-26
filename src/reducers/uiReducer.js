import { redTypes } from "../types/reduxTypes";

const initialState = {
    loading: false,
    msgError: null
}

export const uiReducer = (state = initialState, action) => {

    switch (action.type) {
        // case redTypes.uiSetError:
        //     return {
        //         ...state,
        //         msgError: action.payload
        //     }

        // case redTypes.uiUnSetError:
        //     return {
        //         ...state,
        //         msgError: null
        //     }

        case redTypes.startLoading:
            return {
                ...state,
                loading: true
            }

        case redTypes.stopLoading:
            return {
                ...state,
                loading: false
            }

        default:
            return state;
    }
}
