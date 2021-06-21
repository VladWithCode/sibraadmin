
import { redTypes } from "../types/reduxTypes";

export const setError = (err) => ({
    type: redTypes.uiSetError,
    payload: err
})

export const unSetError = () => ({
    type: redTypes.uiUnSetError
})


export const setTempError = (err) => {
    return(dispatch) => {
        
        dispatch(setError(err));

        setTimeout(() => {
            dispatch(unSetError());
        }, 5001);

    }
}

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