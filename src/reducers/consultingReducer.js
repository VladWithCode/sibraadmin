import { redTypes } from "../types/reduxTypes";


export const consultingReducer = (state = [], action) => {

    switch (action.type) {
        case redTypes.getProjects:
            return action.payload;


        default:
            return state;
    }


}