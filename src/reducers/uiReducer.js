import { redTypes } from "../types/reduxTypes";

const initialState = {
    loading: false,
    msgError: null,
    msgWarning: null,
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
        case redTypes.uiSetError:
            return {
                ...state,
                msgWarning: null,
                msgError: action.payload
            }

        case redTypes.uiSetWarning:
            return {
                ...state,
                msgError: null,
                msgWarning: action.payload
            }

        case redTypes.uiUnSetError:
            return {
                ...state,
                msgError: null
            }

        case redTypes.uiUnSetWarning:
            return {
                ...state,
                msgWarning: null
            }

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
