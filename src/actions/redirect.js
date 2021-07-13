import { redTypes } from "../types/reduxTypes";


export const redirectSet = (type, link) => {
    switch (type) {
        case redTypes.projects:
            return {
                type: redTypes.redirectProjects,
                payload: {
                    projects: link
                }
            }

        case redTypes.clients:
            return {
                type: redTypes.redirectClients,
                payload: {
                    clients: link
                }
            }

        case redTypes.history:
            return {
                type: redTypes.redirectHistory,
                payload: {
                    history: link
                }
            }

        case redTypes.settings:
            return {
                type: redTypes.redirectSettings,
                payload: {
                    settings: link
                }
            }

        default:
            return {};
    }
}