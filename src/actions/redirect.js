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
                type: redTypes.redirectProjects,
                payload: {
                    cients: link
                }
            }

        case redTypes.history:
            return {
                type: redTypes.redirectProjects,
                payload: {
                    history: link
                }
            }

        case redTypes.settings:
            return {
                type: redTypes.redirectProjects,
                payload: {
                    settings: link
                }
            }

        default:
            return {};
    }
}