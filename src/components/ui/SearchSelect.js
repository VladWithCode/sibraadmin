import React, { useEffect, useState } from 'react';
import { isEmptyObject } from '../../helpers/generalHelpers';

function SearchSelect({ id, classList, options, onChange, value }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeSelect, setActiveSelect] = useState(false);
  const [search, setSearch] = useState('');
  const [visibleOptions, setVisibleOptions] = useState(options);
  const [searchIcon, setSearchIcon] = useState(
    <svg viewBox='0 0 32 32'>
      <use href='/assets/svg/search.svg#search'></use>
    </svg>
  );

  const className = ['searchSelect'];
  classList && className.push(...classList);

  useEffect(() => {
    const filteredOptions = [];

    if (search && search.length !== 0) {
      for (const option of options) {
        option.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
          filteredOptions.push(option);
      }
    } else {
      options?.length && filteredOptions.push(...options);
    }

    setVisibleOptions(filteredOptions);
  }, [options, search]);

  useEffect(() => {
    if (
      value &&
      (isEmptyObject(selectedOption) || value !== selectedOption.value)
    )
      setSelectedOption(options.find(o => o.value === value));
  }, [value]);

  const handleOptionClick = option => {
    setSelectedOption(option);

    onChange(option, setActiveSelect);
  };

  const handleDisplayClick = e => {
    setActiveSelect(!activeSelect);

    if (
      activeSelect &&
      selectedOption &&
      Object.keys(selectedOption).length > 0
    ) {
      setSearchIcon(
        <svg
          viewBox='0 0 32 32'
          style={{ transform: 'rotate(45deg)', color: 'red' }}
          onClick={() => setSelectedOption(null)}>
          <use href='/assets/svg/plus.svg#plus'></use>
        </svg>
      );
    }

    if (!activeSelect)
      setSearchIcon(
        <svg viewBox='0 0 32 32'>
          <use href='/assets/svg/search.svg#search'></use>
        </svg>
      );
  };

  const handleSearchChange = ({ target }) => {
    setSearch(target.value);
  };

  return (
    <div
      className={`${className.join(' ')} ${activeSelect ? 'active' : ''}`}
      data-select-id={id}>
      <div className='searchSelect__display' onClick={handleDisplayClick}>
        <div className='value'>
          {selectedOption?.name ? selectedOption.name : 'Sin seleccion'}
        </div>
        <div className='icon'>{searchIcon}</div>
      </div>
      <input
        className='searchSelect__search-bar'
        type='text'
        name='search'
        value={search}
        onChange={handleSearchChange}
        placeholder='Buscar'
        autoComplete='off'
      />
      <div className='searchSelect__options'>
        {visibleOptions && visibleOptions.length > 0 ? (
          visibleOptions.map(option => (
            <div
              className='searchSelect__option'
              key={option.key}
              value={option.value}
              onClick={() => handleOptionClick(option)}>
              {option.name}
            </div>
          ))
        ) : (
          <div className='searchSelect__option no-select text-center'>
            No hay opciones
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchSelect;
