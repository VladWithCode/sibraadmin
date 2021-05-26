import { redTypes } from "../types/reduxTypes";

const initialState = {
    projects: null,
    clients: null,
    history: null,
    settings: null
}

export const redirectReducer = (state = initialState, action) => {
    switch (action.type) {
        case redTypes.redirectProjects:
            return {
                ...state,
                projects: action.payload.projects
            }
    
        default:
            return state;
    }
}