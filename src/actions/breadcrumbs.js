// import { useSelector } from "react-redux";
import { redTypes } from "../types/reduxTypes";


export const breadcrumbsUpdate = (type, arr) => {

    switch (type) {
        case redTypes.projects:
            return {
                type: redTypes.breadcrumbsUpdateProjects,
                payload: {
                    projects: arr
                }
            }

        case redTypes.clients:
            return {
                type: redTypes.breadcrumbsUpdateClients,
                payload: {
                    clients: arr
                }
            }

        case redTypes.history:
            return {
                type: redTypes.breadcrumbsUpdateHistory,
                payload: {
                    history: arr
                }
            }

        case redTypes.settings:
            return {
                type: redTypes.breadcrumbsUpdateSettings,
                payload: {
                    settings: arr
                }
            }

        default:
            return {}
    }
}

export const breadcrumbsClear = (type) => {

    switch (type) {
        case redTypes.projects:
            return {
                type: redTypes.breadcrumbsClearProjects
            }
        case redTypes.clients:
            return {
                type: redTypes.breadcrumbsClearClients
            }

        case redTypes.history:
            return {
                type: redTypes.breadcrumbsClearHistory
            }

        case redTypes.settings:
            return {
                type: redTypes.breadcrumbsClearSettings
            }

        default:
            return {}
    }

}
