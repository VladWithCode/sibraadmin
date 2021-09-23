import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { redTypes } from "../types/reduxTypes";
import { staticURL } from "../url";
import { modalEnable, modalUpdate } from "./modal";
import { uiFinishLoading, uiStartLoading } from "./ui";
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';



export const templatesSetAll = templates => ({
    type: redTypes.templatesSetAll,
    payload: templates
})

export const templatesGet = (projectId) => {

    const url = projectId ? `${staticURL}/templates/${projectId}` : `${staticURL}/templates`

    return (dispatch) => {

        dispatch(uiStartLoading());

        fetch(url)
            .then(res => {
                return res.json();
            })
            .then(data => {

                console.log(data);

                const editorTemplates = data.templates.map(template => {

                    return {
                        ...template,
                        state: { editorState: !template.state ? EditorState.createEmpty() : EditorState.createWithContent(convertFromRaw(JSON.parse(template.state?.toString()))) }
                    }

                })

                dispatch(templatesSetAll(editorTemplates));

                return data
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

export const templatesSetParaph = obj => ({
    type: redTypes.templatesSetParaph,
    payload: obj
})

export const templatesUpdate = templates => {

    return (dispatch) => {

        dispatch(uiStartLoading());

        templates.forEach((template) => {

            const url = `${staticURL}/template/${template._id}`;

            // const templateContent = draftToHtml(convertToRaw(template.state.editorState.getCurrentContent())).replaceAll(' ', '&nbsp;');

            const exp = new RegExp(/<([a-z]+)\s?(style=".*?")?>(<([a-z]+)\s?(style=".*?")?>(.*?)<\/\4>)<\/\1>/gi);

            const strContent = draftToHtml(convertToRaw(template.state.editorState.getCurrentContent()));

            const tempContent = strContent.replace(exp, (str, g1, g2, g3, g4, g5, g6) => {

                return `<${g1}${g2 ? ' ' + g2 : ''}>${!g3 ? '' : `<${g4}${g5 ? ' ' + g5 : ''}>${g6.replaceAll(' ', '&nbsp;')}</${g4}>`}</${g1}>`
            })

            const templateContent = tempContent.replaceAll('<p></p>', '<p><br></p>');

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    doc: {
                        content: templateContent,
                        state: JSON.stringify(convertToRaw(template.state.editorState.getCurrentContent()))
                    }
                })
            })

                .then(res => {
                    console.log(res);
                    return res
                })
                .catch(err => console.log(err))


        })

        dispatch(uiFinishLoading());

        const modalInfo = {
            title: `Plantillas actualizadas con éxito`,
            text: null,
            link: `/plantillas`,
            okMsg: 'Continuar',
            closeMsg: null,
            type: redTypes.templates
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());

    }
}

export const templatesGetVariables = () => {

    const url = `${staticURL}/template/vars`

    return (dispatch) => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                dispatch(templatesSetVariables(data.vars))
            })
            .catch(err => console.log(err))
    }

}

export const templatesSetVariables = (variables) => ({
    type: redTypes.templatesGetVariables,
    payload: variables
})
