import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { floatingButtonSet } from '../../actions/floatingButton';
// import { projectSetPage } from '../../actions/project';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';
import { Create1 } from './Create1';
import { Create2 } from './Create2';

export const CreateProject = () => {

    const dispatch = useDispatch();

    const { page } = useSelector(state => state.project);

    // const { msgError } = useSelector(state => state.ui);

    


    useEffect(() => {

        dispatch(redirectSet(redTypes.projects, '/proyectos/nuevo'));
        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));

    }, [dispatch]);

    // const handleNextPage = () => {
    //     dispatch(projectSetPage(page + 1))
    //     // isFormValid();
    // }



    return (

        <div className="project-create">

            {
                (page === 1) ? <Create1 /> : <Create2 />
            }

        </div>
    )
}
