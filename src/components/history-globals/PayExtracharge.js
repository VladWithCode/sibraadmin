import React from 'react'
import { useParams } from 'react-router-dom'

export const PayExtracharge = () => {

    const { extraChargeId } = useParams()

    return (
        <div>
            {extraChargeId}
        </div>
    )
}
