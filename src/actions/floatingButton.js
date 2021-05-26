import { redTypes } from "../types/reduxTypes";


export const floatingButtonSet = (iconName = 'pencil', type) => ({
    type: redTypes.floatingButtonSet,
    payload: {
        iconName,
        type
    }   
});

