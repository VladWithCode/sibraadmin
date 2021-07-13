import { redTypes } from "../types/reduxTypes";

const initialState = {
    loading: false,
    msgError: null,
    msgWarning: null,
    msgSuccess: null,
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
                msgSuccess: null,
                msgError: action.payload
            }

        case redTypes.uiSetWarning:
            return {
                ...state,
                msgError: null,
                msgSuccess: null,
                msgWarning: action.payload
            }

        case redTypes.uiSetSuccessNotice:
            return {
                ...state,
                msgError: null,
                msgWarning: null,
                msgSuccess: action.payload
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

        case redTypes.uiUnSetSuccessNotice:
            return {
                ...state,
                msgSuccess: null
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
