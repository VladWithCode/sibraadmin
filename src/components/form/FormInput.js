import React from 'react';

const FormInput = ({
  name,
  type,
  value,
  onChange,
  wrapOnChange,
  validationFn,
  classList,
  required,
  extraAttributes,
}) => {
  const [valid, setValid] = useState(true);

  const onChangeWrapper = wrapOnChange
    ? e => {
        setValid(validationFn(e.target));

        return onChange(e);
      }
    : null;

  return (
    <input
      type={type}
      className={[...classList, valid ? '' : ' invalid'].join(' ')}
      onChange={onChangeWrapper}
      value={value}
      name={name}
      id={id}
      {...extraAttributes}
    />
  );
};

export default FormInput;
