import React, { useContext } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { FloatingButton } from '../FloatingButton';
import { usePushBreadcrumbs } from '../../hooks/usePushBreadcrumbs';
import { types } from '../../types';

export const Projects = ({history:{location:{pathname}}}) => {

    const { appData: { projectsBreadcrumbs } } = useContext(AppContext);

    usePushBreadcrumbs(types.projects, `proyectos`, pathname);

    const lastLinkVisited = projectsBreadcrumbs.length - 1;

    const number = 8;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('sent');
    }

    return (

        <div className="app-screen projects-screen">

            <div className="app-screen__title projects-screen-top">
                <h1 className="app-screen__title" >Proyectos</h1>
                <form onSubmit={handleSubmit} className="search">
                    <svg onClick={handleSubmit} ><use href="../assets/svg/search.svg#search" ></use></svg>
                    <input type="text" />
                </form>
            </div>

            <div className="projects">
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/1.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/1.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/1.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/1.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/2.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>
                <NavLink className='projects__card' to={`./proyectos/${number}`} >
                    <div className="projects__card__img">
                        <img src="../assets/img/3.jpg" alt="" />
                    </div>
                    <div className="projects__card__title">
                        Colinas del Mar
                    </div>
                </NavLink>

            </div>

            <FloatingButton type='projects' />

            {
                lastLinkVisited >= 0 && (
                    <Redirect to={projectsBreadcrumbs[lastLinkVisited]?.link} />
                )
            }

        </div>
    )
}
