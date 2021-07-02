
import { redTypes } from "../types/reduxTypes";

// http://189.155.253.90:3000/api/proyects/



export const getProjects = () => {

    const url = 'http://189.155.253.90:3000/api/projects/';

    console.log('obteniendo proyectos');

    return (dispatch) => {
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                dispatch(loadProjects(data.projects))
            });
    }

}

export const loadProjects = (projects) => {
    return {
        type: redTypes.getProjects,
        payload: projects
    }
}
