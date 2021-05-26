import { redTypes } from "../types/reduxTypes";

const initialState = {
    iconName: 'pencil',
    type: null
};

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