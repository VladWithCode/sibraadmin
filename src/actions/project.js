import { redTypes } from "../types/reduxTypes";


export const projectCreate = project => {

    return {
        type: redTypes.projectCreate,
        payload: {
            name: project.name,
            description: project.description,
            manzanas: project.manzanas,
            lots: project.lots,
            services: project.services,
            docs: project.docs,
            pricePerSqM: project.pricePerSqM,
            priceCorner: project.priceCorner
        }
    }
}

export const projectDeleteService = service => ({
    type: redTypes.projectDeleteService,
    payload: {
        service
    }
})

export const projectAddService = service => ({
    type: redTypes.projectAddService,
    payload: {
        service
    }
})






