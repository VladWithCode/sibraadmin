import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { modalUpdate } from '../../actions/modal';
import { breadcrumbsUpdate } from '../../actions/breadcrumbs';
import { getProjects } from '../../actions/consults';
import { redTypes } from '../../types/reduxTypes';

export const Projects = ({ history: { location: { pathname } } }) => {

    const { redirect, projects } = useSelector(state => state);

    const dispatch = useDispatch();

    useEffect(() => {


        const modalInfo = {
            title: 'Crear nuevo proyecto',
            text: '¿Desea crear un proyecto nuevo?',
            link: '/proyectos/nuevo',
            okMsg: 'Sí',
            closeMsg: 'No',
        }

        setTimeout(() => {
            dispatch(modalUpdate(modalInfo));
        }, 1500);

        const breadcrumbs = [
            {
                dispName: 'proyectos',
                link: '/proyectos'
            }
        ]

        dispatch(breadcrumbsUpdate(redTypes.projects, breadcrumbs));
        dispatch(getProjects());

    }, [dispatch]);

    const [searchInput, handleOnChange, reset] = useForm({ inputSearch: '' });

    const { inputSearch } = searchInput;

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

                {
                    projects.map(({ name, _id }) => {

                        const progress = ''

                        return (

                            <NavLink key={_id} className='projects__card' to={`./proyectos/ver/${name}`} >
                                <div className="projects__card__img">
                                    <img src="../assets/img/1.jpg" alt="" />
                                </div>
                                <div className="projects__card__title">
                                    {name}
                                    {/* <progress max="100" value="70"> 70% </progress> */}
                                </div>
                            </NavLink>
                        )
                    })
                }


            </div>


            {
                redirect.projects && <Redirect to={redirect.projects} />
            }


        </div>
    )
}
