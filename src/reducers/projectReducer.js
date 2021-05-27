import { redTypes } from "../types/reduxTypes";

const initialState = {
    name: '',
    description: '',
    manzanas: '',
    lots: '',
    services: [
        'Pavimento',
        'Servicio de luz',
        'Agua y drenaje',
        'Banqueta',
        'Vigilancia',
        'Alberca común'
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
        {
            type: 'a',
            sameArea: true,
            size: 96,
            isCorner: false,
        },
        {
            type: 'b',
            sameArea: true,
            size: 150,
            isCorner: false,
        },
        {
            type: 'c',
            sameArea: false,
            size: 0,
            isCorner: false,
        }
    ]
}


export const projectReducer = (state = initialState, action) => {

    switch (action.type) {
        case redTypes.projectCreate:
            return {
                name: action.payload.name,
                description: action.payload.description,
                manzanas: action.payload.manzanas,
                lots: action.payload.lots,
                services: action.payload.services,
                docs: action.payload.docs,
                pricePerSqM: action.payload.pricePerSqM,
                priceCorner: action.payload.priceCorner
            }

        case redTypes.projectEdit:
            return {
                name: action.payload.name,
                description: action.payload.description,
                manzanas: action.payload.manzanas,
                lots: action.payload.lots,
                services: action.payload.services,
                docs: action.payload.docs,
                pricePerSqM: action.payload.pricePerSqM,
                priceCorner: action.payload.priceCorner
            }

        case redTypes.projectAddService:
            return {
                ...state,
                services: [...state.services, action.payload.service]
            }

        case redTypes.projectDeleteService:

            const services = state.services;
            const newServices = services.filter(service => service !== action.payload.service);

            return {
                ...state,
                services: newServices
            }

        default:
            return state;
    }

}