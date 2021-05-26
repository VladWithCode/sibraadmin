import React from 'react';
// import { AppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { redTypes } from '../types/reduxTypes';
import { redirectSet } from '../actions/redirect';

export const BreadCrumbs = ({ type }) => {

    const dispatch = useDispatch();

    const { projects, clients, history, settings } = useSelector(state => state.breadcrumbs);

    const hanldeClick = (link) => {
        dispatch(redirectSet(redTypes.projects, link))
    }

    switch (type) {
        case redTypes.projects:
            return (
                <div className="breadcrumbs">
                    {
                        projects.map((e, index) => (
                            index !== projects.length -1 && (
                                <Link onClick={() => hanldeClick(e.link)} className="breadcrumbs__item" key={`lot:${e.dispName}`} to={e.link} ><i>&#60;</i><span>{e.dispName}</span> </Link>
                            )
                        ))
                    }
                </div>
            )

        case redTypes.clients:
            return (
                <div className="breadcrumbs">
                    {
                        clients.map((e, index) => (
                            index !== clients.length -1 && (
                                <Link onClick={() => hanldeClick(e.link)} className="breadcrumbs__item" key={`lot:${e.dispName}`} to={e.link} ><i>&#60;</i><span>{e.dispName}</span> </Link>
                            )
                        ))
                    }
                </div>
            )

        case redTypes.history:
            return (
                <div className="breadcrumbs">
                    {
                        history.map((e, index) => (
                            index !== history.length -1 && (
                                <Link onClick={() => hanldeClick(e.link)} className="breadcrumbs__item" key={`lot:${e.dispName}`} to={e.link} ><i>&#60;</i><span>{e.dispName}</span> </Link>
                            )
                        ))
                    }
                </div>
            )

        case redTypes.settings:
            return (
                <div className="breadcrumbs">
                    {
                        settings.map((e, index) => (
                            index !== settings.length -1 && (
                                <Link onClick={() => hanldeClick(e.link)} className="breadcrumbs__item" key={`lot:${e.dispName}`} to={e.link} ><i>&#60;</i><span>{e.dispName}</span> </Link>
                            )
                        ))
                    }
                </div>
            )

        default:
            return (
                <div className="breadcrumbs"><p className="breadcrumbs__item">No hay</p></div>
            )
    }

}