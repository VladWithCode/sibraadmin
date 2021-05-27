import { redTypes } from "../types/reduxTypes";

const initialState = {
    loading: false,
    msgError: null,
    editPage: 1,
    inputModal: {
        active: false,
        beenClosed: false,
        name: '',
        doc: ''
    }
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

        case redTypes.editPageSet:
            return {
                ...state,
                editPage: action.payload.editPage
            }

        default:
            return state;
    }
}
