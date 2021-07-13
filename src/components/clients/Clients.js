import React, { useEffect, useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { modalUpdate } from '../../actions/modal';
import { getClients } from '../../actions/consults';
import { floatingButtonSet } from '../../actions/floatingButton';
import { redTypes } from '../../types/reduxTypes';

export const Clients = () => {

    const dispatch = useDispatch();
    const { clients, redirect } = useSelector(state => state);

    const [searchInput, handleInputChange] = useForm({ inputSearch: '' });

    const { inputSearch } = searchInput;

    const [foundClients, setFoundClients] = useState([])

    useEffect(() => {
        dispatch(getClients());

        const modalInfo = {
            title: 'Crear nuevo cliente',
            text: '¿Desea crear un cliente nuevo?',
            link: '/clientes/nuevo',
            okMsg: 'Sí',
            closeMsg: 'No',
        }

        setTimeout(() => {
            dispatch(modalUpdate(modalInfo));
        }, 1500);

        dispatch(floatingButtonSet('plus', redTypes.clients));


    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        handleInputChange(e);
        const search = e.target.value;
        setFoundClients(clients.filter(p => (`${p.names} ${p.patLastname} ${p.matLastname} ${p.id}`.toLowerCase().includes(search.toLowerCase()))));
    }

    const dispClients = foundClients.length >= 1 ? foundClients : clients;

    return (


        <>
            <div className="app-screen projects-screen">

                <div className="app-screen__title projects-screen-top">
                    <h1 className="app-screen__title" >Clientes</h1>
                    <form className="search">
                        <svg  ><use href="../assets/svg/search.svg#search" ></use></svg>
                        <input onChange={handleSearch} value={inputSearch} placeholder="Nombre/RFC" type="text" name="inputSearch" />
                    </form>
                </div>

                <div className="clients">
                    {
                        dispClients?.map(({ _id, names, patLastname, matLastname, phoneNumber, id: rfc }) => {

                            const name = `${names} ${patLastname && patLastname} ${matLastname && matLastname}`

                            return (
                                <NavLink key={_id} to={`./clientes/ver/${_id}`} className="clients__card" >
                                    <h4 className="name">{name}</h4>
                                    <span className="rfc">{rfc} </span>

                                    <p className="phone">Tel. {phoneNumber}</p>
                                </NavLink>
                            )

                        })
                    }
                </div>

            </div>

            {
                redirect.clients && <Redirect to={redirect.clients} />
            }


        </>

    )
}
