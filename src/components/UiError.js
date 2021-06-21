import React from 'react'
import { useSelector } from 'react-redux'

export const UiError = () => {

    const {msgError} = useSelector(state => state.ui)

    return (
        <>
            {
                msgError && (
                    <span className="uiError">
                        {msgError}
                    </span>
                )
            }
        </>
    )
}
