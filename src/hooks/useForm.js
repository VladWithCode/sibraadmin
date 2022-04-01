import { useState } from 'react';

export const useForm = (initialState = {}) => {
  const [values, setvalues] = useState(initialState);

  // useEffect(() => {
  //   setvalues(initialState)
  // }, [initialState])

  const reset = () => {
    setvalues(initialState);
  };

  const handleInputChange = ({ target }) => {
    setvalues({
      ...values,
      [target.name]: target.value,
    });
  };

  const setValue = (field, value) => {
    setvalues({
      ...values,
      [field]: value,
    });
  };
  return [values, handleInputChange, reset, setValue, setvalues];
};
