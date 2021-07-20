import { redTypes } from "../types/reduxTypes";



export const lotTypesCreate = ({ type, sameArea, pricePerM, cornerPrice, area, front, side }) => {
    return {
        type: redTypes.lotTypesCreate,
        payload: {
            type,
            sameArea,
            pricePerM,
            cornerPrice,
            area,
            front,
            side
        }
    }
}


export const lotTypesEdit = (type, { newType, sameArea, pricePerM, area, front, side }) => {
    return {
        type: redTypes.lotTypesEdit,
        payload: {
            type,
            newType,
            sameArea,
            pricePerM,
            area,
            front,
            side
        }
    }
}

export const lotTypesSet = (restart, lotTypes) => {
    if (restart) {
        return {
            type: redTypes.lotTypesReset
        }
    }

    // type, sameArea, pricePerM, area, front, side

    const newLotTypes = lotTypes.map(({ code, price, area, measures, _id }) => {
        const obj = {
            type: code,
            pricePerM: price,
            _id
        }

        if (area) {
            obj['sameArea'] = true;
            obj['front'] = measures[0].value;
            obj['side'] = measures[1].value;
        }

        return obj;

    })


    return {
        type: redTypes.lotTypesSet,
        payload: newLotTypes
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

export const lotTypesModalConfirmUpdate = ({ title, text, okMsg, closeMsg, action, type }) => {
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

export const lotTypesModalConfirmReset = () => ({
    type: redTypes.lotTypesModalConfirmReset
})


