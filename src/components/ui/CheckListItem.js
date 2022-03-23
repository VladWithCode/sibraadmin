import React, { useEffect, useState } from 'react';

function CheckListItem({
  classList,
  content,
  checked,
  handleCheckboxClick,
  children,
}) {
  const className = ['ui-list__item ui-checkitem'];
  const [checkBoxElement, setCheckBoxElement] = useState();

  useEffect(() => {
    if (checked) {
      setCheckBoxElement(
        <svg className='ui-checkitem__icon'>
          <use href='../assets/svg/checkbox-checked.svg#checked'></use>
        </svg>
      );
    } else {
      setCheckBoxElement(
        <svg className='ui-checkitem__icon' viewBox='0 0 32 32'>
          <use href='../assets/svg/checkbox-unchecked.svg#unchecked'></use>
        </svg>
      );
    }
  }, [checked]);

  classList && className.push(...classList);

  return (
    <li className={className.join(' ')}>
      <div className={`ui-checkitem__checkbox`} onClick={handleCheckboxClick}>
        {checkBoxElement}
      </div>
      <div
        className={`ui-checkitem__content ${checked ? 'checked' : ''}`}
        onClick={handleCheckboxClick}>
        {content}
      </div>
      {children}
    </li>
  );
}

export default CheckListItem;

/* 

<li className={className.join(' ')}>
      <input
        className='ui-checkitem__check'
        type='checkbox'
        name={name}
        checked={checked}
        onChange={e => console.log(e)}
      />
      <label
        htmlFor={name}
        className='ui-list__label ui-checkitem__label text-black'>
        {label}
      </label>
      {children}
    </li>
*/
