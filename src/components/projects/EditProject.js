import React from 'react'
import { useParams } from 'react-router-dom'

export const EditProject = () => {

    const { projectId } = useParams();

    return (
        <h1>Editar proyecto {projectId}</h1>
    )
}
