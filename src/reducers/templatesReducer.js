// import { EditorState } from "draft-js";
import { redTypes } from "../types/reduxTypes";


const initialState = {
    variables: [],
    ogTemplates: [],
    currentTemplates: []
}

let paraphId = 0;
let signatureId = 0;

const addId = type => {

    switch (type) {
        case 'p':
            paraphId += 1;
            return +paraphId;

        case 's':
            signatureId += 1;
            return +signatureId;

        default:
            return 0;
    }

}

export const templatesReducer = (state = initialState, action) => {

    switch (action.type) {

        case redTypes.templatesGetVariables:

            return {
                ...state,
                variables: action.payload
            }

        case redTypes.templatesSetAll:
            return {
                ...state,
                currentTemplates: action.payload,
                ogTemplates: action.payload
            }

        case redTypes.templateSet:

            const current = state.currentTemplates.find(t => t._id === action.payload._id);

            current.state = { ...action.payload.state }

            return {
                ...state
            }

        case redTypes.templatesAddParaph:
            let template = state.currentTemplates.find(t => t._id === action.payload);

            template.paraphs.push({
                _id: addId('p').toString(),
                content: '',
                hasChanged: false,
                delete: false
            });

            return {
                ...state
            }

        case redTypes.templatesDeleteParaph:
            let currentTemplate = state.currentTemplates.find(t => t._id === action.payload.templateId);

            const paraphIndex = currentTemplate.paraphs.indexOf(p => p._id === action.payload.paraphId);

            console.log(currentTemplate.paraphs);
            currentTemplate.paraphs.splice(paraphIndex, 1);
            console.log(currentTemplate.paraphs);

            return {
                ...state
            }

        case redTypes.templatesSetParaph:

            let currentTemplat = state.currentTemplates.find(t => t._id === action.payload.templateId);

            currentTemplat.paraphs.find(p => p._id === action.payload.paraphId).content = action.payload.content

            return {
                ...state
            }

        case redTypes.templatesUpdate:



            return {}

        default:
            return state;
    }

}