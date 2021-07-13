import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { breadcrumbsUpdate } from '../../actions/breadcrumbs';
import { modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { getLots } from '../../actions/consults';
import { redTypes } from '../../types/reduxTypes';
import { BreadCrumbs } from '../BreadCrumbs';
import { FloatingButton } from '../FloatingButton';
import { LotsList } from '../lots/LotsList';

export const Project = React.memo(({ history: { location: { pathname } } }) => {

    const { projectId } = useParams();
    const dispatch = useDispatch();

    const { projects } = useSelector(state => state);

    const { name, _id, associationName, totalLots, description, isFracc, reservedLots, liquidatedLots, deliveredLots, lotTypes, availableServices, manzanas } = projects.find(({ _id }) => _id === projectId);

    const [searchParams, setSearchParams] = useState({
        searchOrder: null,
        searchManzana: null,
        searchLot: null
    });

    const dispManzanas = [];

    for (let i = 0; i < manzanas; i++) {
        dispManzanas.push(i + 1);
    }

    useEffect(() => {

        const breadcrumbs = [
            {
                dispName: 'proyectos',
                link: '/proyectos'
            },
            {
                dispName: ` ${name}`,
                link: `/proyectos/ver/${_id}`
            }
        ]

        dispatch(breadcrumbsUpdate(redTypes.projects, breadcrumbs));
        dispatch(redirectSet(redTypes.projects, `/proyectos/ver/${_id}`));

        dispatch(getLots(_id))

        const modalInfo = {
            title: 'Editarproyecto',
            text: '¿Desea editar el proyecto {name}?',
            link: `/proyectos/editar/${_id}`,
            okMsg: 'Sí',
            closeMsg: 'No',
        }

        dispatch(modalUpdate(modalInfo));



    }, [dispatch, _id, name]);



    return (
        <>
            <BreadCrumbs type={redTypes.projects} />

            <div className="project">


                <div className="project__header">
                    <div className="left">
                        <h3> {name} </h3>
                        <span> {associationName} </span>
                    </div>
                    <div className="right">
                        <div className="item">
                            <p> {totalLots} </p>
                            <span>Lotes totales</span>
                        </div>
                        <div className="item total">
                            <p> {deliveredLots} </p>
                            <span>Lotes vendidos</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card__header">
                        <img src="/../assets/img/info.png" alt="" />
                        <h4>Información General del Proyecto</h4>
                    </div>
                    <div className="card__body">
                        <div className="right">
                            <div className="card__body__item">
                                <span>Asociación</span>
                                <p> {associationName} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Es Fraccionamiento</span>
                                <p> {isFracc ? 'Sí' : 'No'} </p>
                            </div>
                            <div className="card__body__item description">
                                <span>Descripción del Proyecto</span>
                                <p> {description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, hic dolorum eveniet obcaecati debitis quaerat voluptas illo totam sunt ut quia non iusto quis nisi facere officia laborum fugiat minus ipsa consequuntur, in quo optio odio perferendis. Error, nisi? Quae. </p>
                            </div>
                        </div>
                        <div className="left">
                            <div className="card__body__item">
                                <span>Lotes totales</span>
                                <p> {totalLots} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Lotes vendidos</span>
                                <p> {reservedLots} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Lotes liquidados</span>
                                <p> {liquidatedLots} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Número de Manzanas</span>
                                <p> {manzanas} </p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="card-grid">
                    <div className="card scroll">
                        <div className="card__header">
                            <img src="/../assets/img/services.png" alt="" />
                            <h4>Servicios Disponibles</h4>
                        </div>
                        <div className="card__body__list">
                            {
                                availableServices.map(service => (
                                    service.length > 0 && (
                                        <div key={service} className="card__body__list__item">
                                            <p>{service}</p>
                                        </div>
                                    )
                                ))
                            }
                        </div>
                        <div className="card__header mt-4">
                            <img src="/../assets/img/docs.png" alt="" />
                            <h4>Documentos Disponibles</h4>
                        </div>
                        <div className="card__body__list">
                            {
                                // files.map(({ title, doc }) => (
                                //     <div className="card__body__list__doc">
                                //         <p>
                                //             Escrituras
                                //         </p>
                                //     </div>
                                // ))
                            }
                            <div className="card__body__list__doc">
                                <p>
                                    Contrato de Agua
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="card scroll">
                        <div className="card__header">
                            <img src="/../assets/img/home.png" alt="" />
                            <h4>Tipos de lotes</h4>
                        </div>
                        <div className="card__body__list">
                            {
                                lotTypes.map(({ _id, code, pricesPerSqMeter: { corner, regular }, area, measures }) => (
                                    <div key={_id} className="card__body__list__lotType">
                                        <div className="header">
                                            <h4>Tipo de lote "{code}"</h4>
                                        </div>
                                        <div className="body">
                                            {
                                                area && (
                                                    <div className="card__body__item">
                                                        <span>Área</span>
                                                        <p>{area}m<sup>2</sup> </p>
                                                    </div>
                                                )
                                            }
                                            <div className="prices">
                                                <h5>
                                                    Precios por m<sup>2</sup>
                                                </h5>
                                                <div className="card__body__item">
                                                    <span>
                                                        Regular
                                                    </span>
                                                    <p>
                                                        ${regular}
                                                    </p>
                                                </div>
                                                <div className="card__body__item">
                                                    <span>
                                                        Esquinas
                                                    </span>
                                                    <p>
                                                        ${corner}
                                                    </p>
                                                </div>
                                            </div>
                                            {
                                                measures?.length > 0 && (
                                                    <div className="measures">
                                                        <h5>Medidas</h5>
                                                        {
                                                            measures.map((measure) => (
                                                                <div key={measure._id} className="card__body__item">
                                                                    <span>
                                                                        {measure.title}
                                                                    </span>
                                                                    <p>
                                                                        {measure.value}m<sup>2</sup>
                                                                    </p>
                                                                </div>
                                                            )
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>


                    </div>
                </div>


                <div className="card">
                    <div className="card__header">
                        <img src="/../assets/img/lots.png" alt="" />
                        <h4>Lista de Lotes</h4>
                    </div>
                    <div className="card__form">
                        <div className="order">
                            <span>Ordenar por:</span>
                            <select onChange={e => setSearchParams({ ...searchParams, searchOrder: e.target.value })} name="order" id="order">
                                <option value={null}></option>
                                <option value="higher">Mayor precio</option>
                                <option value="lower">Menor precio</option>
                                <option value="available">Disponibles</option>
                                <option value="reserved">Apartados</option>
                                <option value="liquidated">Pagados</option>
                                <option value="delivered">Entregados</option>
                            </select>
                        </div>
                        <div className="search">
                            <div className="item">
                                <span>Manzana</span>
                                <select onChange={e => setSearchParams({ ...searchParams, searchManzana: e.target.value })} name="manzana" id="manzana">
                                    <option value={null}></option>
                                    {
                                        dispManzanas.map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="item">
                                <label htmlFor="lotNum">Lote</label>
                                <input onChange={e => setSearchParams({ ...searchParams, searchLot: e.target.value })} value={searchParams.searchLot} type="number" name="lotNum" />
                            </div>
                        </div>
                    </div>


                    <LotsList searchParams={searchParams} projectId={projectId} sortType={1} />

                </div>



            </div>

            <FloatingButton type='project' projectId={projectId} />

        </>
    )
})
