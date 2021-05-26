
import { redTypes } from "../types/reduxTypes";

// export const setError = (err) => ({
//     type: types.uiSetError,
//     payload: err
// })

// export const unSetError = () => ({
//     type: types.uiUnSetError
// })

export const uiStartLoading = () => ({
    type: redTypes.startLoading
})

export const uiFinishLoading = () => ({
    type: redTypes.stopLoading
})