import { redTypes } from "../types/reduxTypes";

const initialState = {
    projects: null,
    clients: null,
    history: null,
    templates: null
}

export const redirectReducer = (state = initialState, action) => {
    switch (action.type) {
        case redTypes.redirectProjects:
            return {
                ...state,
                projects: action.payload.projects
            }

        case redTypes.redirectClients:
            return {
                ...state,
                clients: action.payload.clients
            }

        case redTypes.history:
            return {
                ...state,
                history: action.payload.history
            }

        case redTypes.templates:
            return {
                ...state,
                templates: action.payload.templates
            }

        default:
            return state;
    }
}