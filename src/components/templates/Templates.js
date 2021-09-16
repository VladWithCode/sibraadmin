import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { redirectSet } from '../../actions/redirect';
import { templatesGet, templatesGetVariables } from '../../actions/templates';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';

export const Templates = () => {

    const dispatch = useDispatch();

    const { projects } = useSelector(state => state);

    const [searchInput, handleInputChange] = useForm({ inputSearch: '' });

    const { inputSearch } = searchInput;

    const [foundProjects, setFoundProjects] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        handleInputChange(e);
        const search = e.target.value;
        setFoundProjects(projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
    }

    const dispProjects = foundProjects.length >= 1 ? foundProjects : projects;

    useEffect(() => {
        dispatch(templatesGetVariables());
    }, [dispatch])

    return (
        <div className="app-screen projects-screen">

            <div className="app-screen__title projects-screen-top">
                <h1 className="app-screen__title" >Plantillas</h1>
                <form className="search">
                    <svg ><use href={`../assets/svg/search.svg#search`} ></use></svg>
                    <input type="text" name="inputSearch" value={inputSearch} onChange={handleSearch} />
                </form>
            </div>

            <div className="projects">

                <NavLink onClick={() => dispatch(templatesGet())} className='projects__card default-template' to={`/plantillas/default`} >

                    <div className="main-info">
                        <h4>
                            Plantillas por defecto
                        </h4>
                    </div>

                </NavLink>

            </div>

            <div className="templates">

                {

                    dispProjects?.map(({ name, _id }) => {

                        return (

                            <NavLink
                                onClick={() => {
                                    dispatch(redirectSet(redTypes.templates, `/plantillas/${_id}`));
                                    dispatch(templatesGet(_id));
                                }}
                                key={_id}
                                className='templates__card'
                                to={`/plantillas/${_id}`} >

                                <div className="main-info">
                                    <h4>
                                        {name}
                                    </h4>
                                </div>

                            </NavLink>


                        )
                    })

                }


            </div>

        </div>
    )
}
