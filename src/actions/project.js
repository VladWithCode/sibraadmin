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

export const projectEnableSvcModal = () => ({
    type: redTypes.projectEnableSvcModal
})

export const projectDisableSvcModal = () => ({
    type: redTypes.projectDisableSvcModal
})

export const projectUpdateSvcModal = modal => {

    return {
        type: redTypes.projectUpdateSvcModal,
        payload: {
            title: modal.title ? modal.title : null,
            text: modal.text ? modal.text : null,
            okMsg: modal.okMsg ? modal.okMsg : null,
            closeMsg: modal.closeMsg ? modal.closeMsg : null,
            action: modal.action ? modal.action : null,
            input: modal.input ? modal.input : null
        }
    }
}

export const projectSetPage = page => {
    if (typeof page === 'number'){
        return {
            type: redTypes.projectSetPage,
            payload: {
                page
            }
        }
    }
}






