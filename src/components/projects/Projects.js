import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { modalUpdate } from '../../actions/modal';
import { breadcrumbsUpdate } from '../../actions/breadcrumbs';
import { redTypes } from '../../types/reduxTypes';

export const Projects = ({ history: { location: { pathname } } }) => {

    const { projects } = useSelector(state => state.redirect);

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(modalUpdate('Crear nuevo proyecto', '¿Desea crear un proyecto nuevo?', './proyectos/nuevo', 'Sí', 'No', null, null));

        const breadcrumbs = [
            {
                dispName: 'proyectos',
                link: '/proyectos'
            }
        ]

        dispatch(breadcrumbsUpdate(redTypes.projects, breadcrumbs));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const number = 8;

    const [formFields, handleOnChange, reset] = useForm({ inputSearch: '' });

    const { inputSearch } = formFields;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputSearch);
        reset();
    }

    return (

        <div className="app-screen projects-screen">

            <div className="app-screen__title projects-screen-top">
                <h1 className="app-screen__title" >Proyectos</h1>
                <form onSubmit={handleSubmit} className="search">
                    <svg onClick={handleSubmit} ><use href="../assets/svg/search.svg#search" ></use></svg>
                    <input type="text" name="inputSearch" value={inputSearch} onChange={handleOnChange} />
                </form>
            </div>

            <div className="projects">
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/1.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/1.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/1.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/1.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/ver/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>

            </div>


            {
                projects && <Redirect to={projects} />
            }


        </div>
    )
}
