import React from 'react';

const Form = ({ formTitle, iconPath, extraClasses, children }) => {
  const classList = [...extraClasses, 'card', 'edit'].join(' ');

  return (
    <div className={classList}>
      <div className='card__header'>
        {iconPath && <img src={iconPath} alt='Icon Form' />}
        <h4>{formTitle}</h4>
      </div>
      <div className='card__body'>{...children}</div>
    </div>
  );
};

export default Form;
