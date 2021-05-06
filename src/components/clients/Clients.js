import React from 'react';
import { NavLink } from 'react-router-dom';

export const Clients = () => {
    return (
        <NavLink to={`/cliente/${5}`} >
            Clientes    
        </NavLink>
    )
}
