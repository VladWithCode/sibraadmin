import { redTypes } from "../types/reduxTypes";


export const floatingButtonSet = (iconName = 'plus', type) => ({
    type: redTypes.floatingButtonSet,
    payload: {
        iconName,
        type
    }
});

export const secondaryFloatingButtonSet = (iconName = 'bill', type, projectId, lotId) => ({
    type: redTypes.secondaryFloatingButtonSet,
    payload: {
        iconName,
        type,
        projectId,
        lotId
    }
})