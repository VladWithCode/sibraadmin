import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { modalUpdate } from '../../actions/modal';
import { getProjects } from '../../actions/consults';
import { floatingButtonSet } from '../../actions/floatingButton';
import { redTypes } from '../../types/reduxTypes';

export const Projects = React.memo(({ history: { location: { pathname } } }) => {

    const { redirect, projects } = useSelector(state => state);

    const [searchInput, handleInputChange] = useForm({ inputSearch: '' });

    const { inputSearch } = searchInput;

    const [foundProjects, setFoundProjects] = useState([]);

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


        dispatch(floatingButtonSet('plus', redTypes.projects));
        dispatch(getProjects());

    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        handleInputChange(e);
        const search = e.target.value;
        setFoundProjects(projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
    }

    const dispProjects = foundProjects.length >= 1 ? foundProjects : projects;

    return (

        <div className="app-screen projects-screen">

            <div className="app-screen__title projects-screen-top">
                <h1 className="app-screen__title" >Proyectos</h1>
                <form className="search">
                    <svg ><use href="../assets/svg/search.svg#search" ></use></svg>
                    <input type="text" name="inputSearch" value={inputSearch} onChange={handleSearch} />
                </form>
            </div>

            <div className="projects">

                {

                    dispProjects?.map(({ name, _id, associationName, totalLots, description, reservedLots, liquidatedLots, availableLots }) => {

                        return (

                            <NavLink key={_id} className='projects__card' to={`./proyectos/ver/${_id}`} >
                                <span className="available-lots">
                                    {totalLots} lotes
                                </span>
                                <div className="lots-info">

                                    <span><strong>{reservedLots}</strong> apartados</span>

                                    <span><strong>{liquidatedLots}</strong> liquidados</span>

                                    <span><strong>{availableLots}</strong> disponibles</span>
                                </div>
                                <div className="main-info">
                                    <span className="association">
                                        {associationName}
                                    </span>
                                    <h4>
                                        {name}
                                    </h4>
                                    <p className="description">
                                        {description}
                                    </p>
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
})
