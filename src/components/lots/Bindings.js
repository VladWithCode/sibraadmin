import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  lotAddBinding,
  lotDeleteBinding,
  lotSetBindings,
} from '../../actions/lot';

export const Bindings = ({ bindings }) => {
  const dispatch = useDispatch();

  const [currentBindings, setCurrentBindings] = useState(bindings);

  const addBinding = () => {
    dispatch(lotAddBinding());
  };

  const inputChange = e => {
    currentBindings[e.target.name] = e.target.value;

    setCurrentBindings(currentBindings);

    dispatch(lotSetBindings(currentBindings));
  };

  const deleteBinding = index => {
    dispatch(lotDeleteBinding(index));
  };

  return (
    <div className='card edit'>
      <div className='card__header'>
        <img src='../assets/img/info.png' alt='' />
        <h4>Colindancias</h4>

        <button onClick={addBinding} className='add-ref'>
          Agregar colindancia
        </button>
      </div>

      <div className='card__body'>
        <div className='full'>
          {currentBindings.map((binding, index) => (
            <div key={index} className='card__body__item mt-2'>
              <label htmlFor={`binding-${index}`}></label>
              <input
                id={`binding-${index}`}
                type='text'
                value={currentBindings[index]}
                onChange={inputChange}
                name={index}
              />
              <button
                onClick={() => deleteBinding(index)}
                className='delete-area'>
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
