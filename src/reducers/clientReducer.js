import { redTypes } from "../types/reduxTypes";


const initialState = {
    names: '',
    patLastname: '',
    matLastname: '',
    _id: '',
    curp: '',
    email: '',
    phoneNumber: '',
    col: '',
    street: '',
    zip: '',
    extNumber: '',
    intNumber: '',
    refs: [
        {
            names: '',
            patLastname: '',
            matLastname: '',
            email: '',
            phoneNumber: '',
            col: '',
            street: '',
            zip: '',
            extNumber: '',
            intNumber: ''
        }
    ]
}


export const clientReducer = (state = initialState, action) => {

    switch (action.type) {
        case redTypes.clientSet:
            return action.payload;

        default:
            return state;
    }

}