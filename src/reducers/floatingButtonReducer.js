import { redTypes } from "../types/reduxTypes";

const initialState = {
    iconName: 'plus',
    type: null
};

const secondaryInitialState = {
    iconName: 'bill',
    type: null,
    projectId: '0',
    lotId: '0'
}

export const floatingButtonReducer = (state = initialState, action) => {

    switch (action.type) {
        case redTypes.floatingButtonSet:
            return {
                iconName: action.payload.iconName,
                type: action.payload.type
            }

        default:
            return state
    }

}

export const secondaryFloatingButtonReducer = (state = secondaryInitialState, action) => {

    switch (action.type) {
        case redTypes.secondaryFloatingButtonSet:
            return {
                iconName: action.payload.iconName,
                type: action.payload.type,
                projectId: action.payload.projectId,
                lotId: action.payload.lotId
            }

        default:
            return state;
    }

}