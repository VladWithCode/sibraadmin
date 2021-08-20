import { redTypes } from "../types/reduxTypes";
import { uiStartLoading, uiFinishLoading } from "./ui";
import { staticURL } from '../url';


export const projectCreate = project => {

    return {
        type: redTypes.projectCreate,
        payload: {
            name: project.name,
            description: project.description,
            associationName: project.associationName,
            isFracc: project.isFracc,
            manzanas: project.manzanas,
            lots: project.lots,
            services: project.services,
            docs: project.docs,
            pricePerSqM: project.pricePerSqM,
            priceCorner: project.priceCorner,
            greenAreas: project.greenAreas,
            notary: project.notary,
            propertyScripture: project.propertyScripture,
            propertyBook: project.propertyBook,
            scriptureDate: project.scriptureDate,
            constitutiveScripture: project.constitutiveScripture,
            constitutiveVolume: project.constitutiveVolume
        }
    }
}

export const projectReset = () => ({
    type: redTypes.projectReset
})

export const projectSet = project => ({
    type: redTypes.projectSet,
    payload: project

})

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

export const projectSetServices = services => ({
    type: redTypes.projectSetServices,
    payload: services
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
            input: modal.input ? modal.input : null,
            refId: modal.refId ? modal.refId : null
        }
    }
}

export const projectSetPage = page => {
    if (typeof page === 'number') {
        return {
            type: redTypes.projectSetPage,
            payload: {
                page
            }
        }
    }
}


export const uploadProjectDocument = (projectDocument, lots) => {


    return (dispatch) => {

        console.log('Subiendo Proyecto');

        const url = `${staticURL}/project/`;

        const data = {
            projectDocument,
            lots
        }

        console.log(data);

        dispatch(uiStartLoading());

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                dispatch(uiFinishLoading());
                return response.json()
            })
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                dispatch(uiFinishLoading());
            });

    }

}






