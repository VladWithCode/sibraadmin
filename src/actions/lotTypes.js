import { redTypes } from "../types/reduxTypes";



export const lotTypesCreate = ({ type, sameArea, pricePerM, cornerPrice, area }) => {
    return {
        type: redTypes.lotTypesCreate,
        payload: {
            type,
            sameArea,
            pricePerM,
            cornerPrice,
            area
        }
    }
}


export const lotTypesEdit = (type, { newType, sameArea, pricePerM, cornerPrice, area }) => {
    return {
        type: redTypes.lotTypesEdit,
        payload: {
            type,
            newType,
            sameArea,
            pricePerM,
            cornerPrice,
            area
        }
    }
}

export const lotTypesDelete = type => {
    return {
        type: redTypes.lotTypesDelete,
        payload: {
            type
        }
    }
}

export const lotTypesModalEnable = () => {
    return {
        type: redTypes.lotTypesModalEnable
    }
}

export const lotTypesModalDisable = () => {
    return {
        type: redTypes.lotTypesModalDisable
    }
}

export const lotTypesModalConfirmUpdate = ({title, text, okMsg, closeMsg, action, type}) => {
    return {
        type: redTypes.lotTypesModalConfirmUpdate,
        payload: {
            title,
            text,
            okMsg,
            closeMsg,
            action,
            type
        }
    }
}

export const lotTypesModalConfirmEnable = () => {
    return {
        type: redTypes.lotTypesModalConfirmEnable
    }
}

export const lotTypesModalConfirmDisable = () => {
    return {
        type: redTypes.lotTypesModalConfirmDisable
    }
}


