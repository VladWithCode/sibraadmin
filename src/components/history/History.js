import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getRecords } from '../../actions/consults';
import { CalendarComponent } from './Calendar';

export const History = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRecords);
  }, [dispatch]);

  return (
    <div>
      <CalendarComponent></CalendarComponent>
    </div>
  );
};
