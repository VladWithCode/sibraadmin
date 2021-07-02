import React from 'react'
import { useSelector } from 'react-redux'

export const UiError = () => {

    const { msgError, msgWarning } = useSelector(state => state.ui)

    return (
        <>
            {
                msgError && (
                    <span className="uiError">
                        {msgError}
                    </span>
                )
            }
            {
                msgWarning && (
                    <span className="uiError warning">
                        {msgWarning}
                    </span>
                )
            }
        </>
    )
}
