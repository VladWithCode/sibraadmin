
import { redTypes } from "../types/reduxTypes";

export const setError = (err) => ({
    type: redTypes.uiSetError,
    payload: err
})

export const unSetError = () => ({
    type: redTypes.uiUnSetError
})



export const setTempError = (err) => {
    return (dispatch) => {

        dispatch(setError(err));

        setTimeout(() => {
            dispatch(unSetError());
        }, 4001);

    }
}

export const setTempWarning = (warning) => {
    return (dispatch) => {

        dispatch(setWarning(warning));

        setTimeout(() => {
            dispatch(unSetWarning());
        }, 4001);

    }
}

export const setTempSuccessNotice = (msg) => {
    return (dispatch) => {

        dispatch(setSuccessNotice(msg));



        setTimeout(() => {
            dispatch(unSetSuccessNotice());
        }, 4001);

    }
}

export const setWarning = (err) => ({
    type: redTypes.uiSetWarning,
    payload: err
})

export const unSetWarning = () => ({
    type: redTypes.uiUnSetWarning
})

export const setSuccessNotice = (msg) => ({
    type: redTypes.uiSetSuccessNotice,
    payload: msg
})

export const unSetSuccessNotice = () => ({
    type: redTypes.uiUnSetSuccessNotice
})


export const uiStartLoading = () => ({
    type: redTypes.startLoading
})

export const uiFinishLoading = () => ({
    type: redTypes.stopLoading
})

export const editPageSet = editPage => ({
    type: redTypes.editPageSet,
    payload: {
        editPage
    }
})