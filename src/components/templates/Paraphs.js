import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { templatesDeleteParaph } from '../../actions/templates';

export const Paraphs = ({ paraph, index, templateId }) => {

    const dispatch = useDispatch();

    const [paraphValues, setParaphValues] = useState(paraph);

    const { content, hasChange } = paraphValues;

    const [active, setActive] = useState(true);

    const inputChange = (e) => {
        setParaphValues({
            ...paraphValues,
            content: e.target.value
        })
    }

    useEffect(() => {
        setParaphValues(p => ({
            ...p,
            content: paraph.content
        }))
    }, [paraph.content]);

    return (

        <div className={`card__body__item description`}>
            <button onClick={() => dispatch(templatesDeleteParaph(templateId, paraph._id))} className="delete">Eliminar</button>
            <span htmlFor="content">({index})</span>
            <textarea onBlur={() => setActive(!active)} name="content" value={content} onChange={inputChange} ></textarea>
        </div>

    )
}
