import { redTypes } from "../types/reduxTypes";


const initialState = {
    projects: [
        // {
        //     dispName: 'proyectos',
        //     link: '/projectos'
        // }
    ],
    clients: [
        // {
        //     dispName: 'clientes',
        //     link: '/clientes'
        // }
    ],
    history: [
        // {
        //     dispName: 'historial',
        //     link: '/historial'
        // }
    ],
    settings: [
        // {
        //     dispName: 'ajustes',
        //     link: '/ajustes'
        // }
    ],
    templates: []
}

export const breadcrumbsReducer = (state = initialState, action) => {

    switch (action.type) {
        // case redTypes.breadcrumbsUpdateProjects:
        //     return {
        //         ...state,
        //         projects: [...state.projects, action.payload.projects]
        //     }

        // case redTypes.breadcrumbsUpdateClients:
        //     return {
        //         ...state,
        //         clients: [...state.clients, action.payload.clients]
        //     }

        // case redTypes.breadcrumbsUpdateHistory:
        //     return {
        //         ...state,
        //         history: [...state.history, action.payload.history]
        //     }

        // case redTypes.breadcrumbsUpdateSettings:
        //     return {
        //         ...state,
        //         settings: [...state.settings, action.payload.settings]
        //     }

        case redTypes.breadcrumbsUpdateProjects:
            return {
                ...state,
                projects: action.payload.projects
            }

        case redTypes.breadcrumbsUpdateClients:
            return {
                ...state,
                clients: action.payload.clients
            }

        case redTypes.breadcrumbsUpdateHistory:
            return {
                ...state,
                history: action.payload.history
            }

        case redTypes.breadcrumbsUpdateSettings:
            return {
                ...state,
                settings: action.payload.settings
            }

        case redTypes.breadcrumbsClearProjects:
            return {
                ...state,
                projects: []
            }

        case redTypes.breadcrumbsClearClients:
            return {
                ...state,
                clients: []
            }

        case redTypes.breadcrumbsClearHistory:
            return {
                ...state,
                history: []
            }

        case redTypes.breadcrumbsClearSettings:
            return {
                ...state,
                settings: []
            }

        case redTypes.breadcrumbsUpdateTemplates:
            return {
                ...state,
                templates: action.payload.templates
            }

        case redTypes.breadcrumbsClearTemplates:
            return {
                ...state,
                templates: []
            }

        default:
            return state;
    }

}