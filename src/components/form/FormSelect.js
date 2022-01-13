import React from 'react';

const FormSelect = ({
  classList,
  value,
  name,
  onChange,
  extraAttributes,
  children,
}) => {
  return (
    <select
      className={classList}
      name={name}
      value={value}
      onChange={onChange}
      {...extraAttributes}>
      {...children}
    </select>
  );
};

export default FormSelect;
