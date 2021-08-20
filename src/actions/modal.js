import { redTypes } from "../types/reduxTypes";

export const modalUpdate = (modal) => ({
    type: redTypes.modalUpdate,
    payload: {
        title: modal.title,
        text: modal.text,
        link: modal.link ? modal.link : '',
        okMsg: modal.okMsg,
        closeMsg: modal.closeMsg,
        input: modal.input,
        inputValue: modal.inputValue,
        type: modal.type,
        resetClient: modal.resetClient
    }
});

export const modalEnable = () => ({
    type: redTypes.modalEnable
});

export const modalDisable = () => ({
    type: redTypes.modalDisable
});

export const modalSetInput = (input) => ({
    type: redTypes.modalSetInput,
    payload: {
        input
    }
})

export const modalSetInput2 = (input) => ({
    type: redTypes.modalSetInput,
    payload: {
        input2: input
    }
})

export const modalReset = () => ({
    type: redTypes.modalReset
})