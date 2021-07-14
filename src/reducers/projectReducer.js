import { redTypes } from "../types/reduxTypes";

const initialState = {
    page: 1,
    name: '',
    isFracc: false,
    associationName: '',
    description: '',
    manzanas: '',
    lots: '',
    services: [
        // 'Pavimento',
        // 'Servicio de luz',
        // 'Agua y drenaje',
        // 'Banqueta',
        // 'Vigilancia',
        // 'Alberca común'
    ],
    docs: [
        // {
        //     path: '',
        //     name: 'Contrato de servicio de Agua',
        // }
    ],
    pricePerSqM: '',
    priceCorner: '',
    types: [
    ],
    modalServices: {
        active: false,
        beenClosed: false,
        title: '',
        text: '',
        okMsg: '',
        closeMsg: '',
        action: '',
        input: null
    }
}

// export const modalUpdate = (modal) => ({
//     type: redTypes.modalUpdate,
//     payload: {
//         title: modal.title,
//         text: modal.text,
//         link: modal.link? modal.link : '' ,
//         okMsg: modal.okMsg,
//         closeMsg: modal.closeMsg,
//         input: modal.input,
//         inputValue: modal.inputValue
//     }
// });


export const projectReducer = (state = initialState, action) => {

    switch (action.type) {
        case redTypes.projectCreate:
            return {
                ...state,
                name: action.payload.name,
                description: action.payload.description,
                associationName: action.payload.associationName,
                isFracc: action.payload.isFracc,
                manzanas: action.payload.manzanas,
                lots: action.payload.lots,
                services: action.payload.services,
                docs: action.payload.docs,
                pricePerSqM: action.payload.pricePerSqM,
                priceCorner: action.payload.priceCorner
            }

        case redTypes.projectEdit:
            return {
                ...state,
                name: action.payload.name,
                description: action.payload.description,
                manzanas: action.payload.manzanas,
                lots: action.payload.lots,
                services: action.payload.services,
                docs: action.payload.docs,
                pricePerSqM: action.payload.pricePerSqM,
                priceCorner: action.payload.priceCorner
            }

        case redTypes.projectEnableSvcModal:
            return {
                ...state,
                modalServices: {
                    ...state.modalServices,
                    active: true
                }
            }

        case redTypes.projectDisableSvcModal:
            return {
                ...state,
                modalServices: {
                    ...initialState.modalServices,
                    active: false,
                    beenClosed: true
                }
            }

        case redTypes.projectUpdateSvcModal:
            return {
                ...state,
                modalServices: {
                    ...state.modalServices,
                    title: action.payload.title ? action.payload.title : state.modalServices.title,
                    text: action.payload.text ? action.payload.text : state.modalServices.text,
                    okMsg: action.payload.okMsg ? action.payload.okMsg : state.modalServices.okMsg,
                    closeMsg: action.payload.closeMsg ? action.payload.closeMsg : state.modalServices.closeMsg,
                    action: action.payload.action ? action.payload.action : state.modalServices.action,
                    input: action.payload.input ? action.payload.input : state.modalServices.input
                }
            }

        case redTypes.projectSetPage:
            return {
                ...state,
                page: action.payload.page
            }




        default:
            return state;
    }

}