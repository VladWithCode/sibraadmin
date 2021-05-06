import React from 'react';
import { useParams } from 'react-router-dom';

export const Client = () => {

    const {clientId} = useParams();

    return (
        <>
            <h1>Cliente número: {clientId} </h1>
        </>
    )
}
