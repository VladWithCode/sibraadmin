import React from 'react';
import { useSelector } from 'react-redux';
import { Create1 } from './Create1';
import { Create2 } from './Create2';
import { Create3 } from './Create3';

export const CreateProject = () => {

    const { page } = useSelector(state => state.project);

    // const { msgError } = useSelector(state => state.ui);

    


    // useEffect(() => {

    //     dispatch(redirectSet(redTypes.projects, '/proyectos/nuevo'));
    //     dispatch(floatingButtonSet('pencil', redTypes.projectCreate));

    // }, [dispatch]);

    return (

        <div className="project-create">

            {
                (page === 1) ? <Create1 /> : page === 2 ? <Create2 /> : page === 3 ? <Create3 /> : <h1>404</h1>
            }

        </div>
    )
}
