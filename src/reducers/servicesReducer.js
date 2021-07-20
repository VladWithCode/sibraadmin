import { redTypes } from "../types/reduxTypes";

export const servicesReducer = (state = [], action) => {

    switch (action.type) {
        case redTypes.projectAddService:
            return [...state, action.payload.service];


        case redTypes.projectDeleteService:

            const services = state;
            const newServices = services.filter(service => service !== action.payload.service);

            return newServices;

        case redTypes.projectSetServices:
            return action.payload


        default:
            return state;
    }

}