import React from 'react'

export const PriceHistory = ({ priceHistory }) => {


    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }



    return (
        <div className="card mb-5">
            <div className="card__body">
                {
                    priceHistory.map(({ _id, firstSetAt, prevPrice, price }, index) => {


                        const date = new Date(firstSetAt).toLocaleDateString('es-MX', dateOptions);

                        return (
                            <div key={_id} className="right">

                                <div className={`card__header ${index > 1 ? 'mt-4' : 'mt-2'}  `}>
                                    <h4> Precio {index + 1} </h4>
                                </div>

                                <div className="card__body__item">
                                    <span>precio</span>
                                    <p className="price"> ${price.toLocaleString()} </p>
                                </div>
                                {
                                    prevPrice && (
                                        <div className="card__body__item">
                                            <span>precio anterior</span>
                                            <p>${prevPrice.toLocaleString()}</p>
                                        </div>
                                    )
                                }
                                {
                                    index !== 0 && (
                                        <div className="card__body__item">
                                            <span>Fecha de actualización</span>
                                            <p>{date}</p>
                                        </div>
                                    )
                                }
                                <div className="card__boy__item">
                                    <span></span>
                                    <p></p>
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
