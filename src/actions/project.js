import { redTypes } from "../types/reduxTypes"


export const createProject = (name, description, manzanas, lots, services, docs, pricePerSqM, priceCorner) => {

    return {
        type: redTypes.projectCreate,
        payload: {
            name,
            description,
            manzanas,
            lots,
            services,
            docs,
            pricePerSqM,
            priceCorner
        }
    }

}



