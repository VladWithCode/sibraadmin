import { redTypes } from "../types/reduxTypes";


export const floatingButtonSet = (iconName = 'plus', type) => ({
    type: redTypes.floatingButtonSet,
    payload: {
        iconName,
        type
    }   
});

