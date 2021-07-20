import { redTypes } from "../types/reduxTypes";



export const lotReducer = (state = {}, action) => {

    switch (action.type) {
        case redTypes.lotCreate:
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

        case redTypes.lotEdit:
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

        case redTypes.setLot:
            return action.payload


        default:
            return state;
    }

}
