import { redTypes } from "../types/reduxTypes";

export const modalUpdate = (title, text, link, okMsg, closeMsg, input, input2) => ({
    type: redTypes.modalUpdate,
    payload: {
        title,
        text,
        link,
        okMsg,
        closeMsg,
        input,
        input2
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