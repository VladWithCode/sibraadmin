import { redTypes } from "../types/reduxTypes";
import { staticURL } from "../url";
import { uiFinishLoading, uiStartLoading } from "./ui";



export const templatesSetAll = templates => ({
    type: redTypes.templatesSetAll,
    payload: templates
})


export const templatesGet = () => {

    const url = `${staticURL}/templates`

    return (dispatch) => {

        dispatch(uiStartLoading());

        fetch(url)
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(data => {
                console.log(data);
                dispatch(templatesSetAll(data.templates));
            })
            .catch(err => console.log(err));

        dispatch(uiFinishLoading());

    }
}

export const templateSet = template => ({
    type: redTypes.templateSet,
    payload: template
})

export const templatesAddParaph = templateId => ({
    type: redTypes.templatesAddParaph,
    payload: templateId
})

export const templatesDeleteParaph = (templateId, paraphId) => ({
    type: redTypes.templatesDeleteParaph,
    payload: {
        templateId,
        paraphId
    }
})

export const templateUpdate = () => {
    console.log('Actualizar template');
}