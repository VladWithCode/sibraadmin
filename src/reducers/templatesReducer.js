import { redTypes } from "../types/reduxTypes";


const initialState = {
    ogTemplates: [],
    currentTemplates: [
        {
            _id: '123',
            type: 'recibo de pago',
            project: '610844145401dc21adfdd054',

            paraphs: [
                {
                    _id: '123',
                    content: 'Hola panita',
                    hasChanged: false,
                    delete: false
                }
            ],

            signatures: [
                'Claudia Pulgarín'
            ],

            variables: [
                {
                    _id: '789',
                    title: 'cliente'
                },
                {
                    _id: '4654',
                    title: 'notario'
                }
            ]

        },
        {
            _id: '3123',
            type: 'recibo',
            project: '610844145401dc21adfdd054',

            paraphs: [
                {
                    _id: '123',
                    content: 'Hola pai',
                    hasChanged: false,
                    delete: false
                }
            ],

            signatures: [
                'Claudia Pulgarín'
            ],

            variables: [
                {
                    _id: '789',
                    title: 'cliente'
                },
                {
                    _id: '4654',
                    title: 'notario'
                }
            ]

        }
    ]
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

        case redTypes.templatesSetAll:
            return {
                ...state,
                currentTemplates: action.payload
            }

        case redTypes.templateSet:
            let index = state.currentTemplates.findIndex(t => t._id === action.payload._id);
            state.currentTemplates.splice(index, 1, action.payload);

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

        default:
            return state;
    }

}