import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLot } from '../../actions/consults';
import { fetchLot, sortByState, sortLotArray } from '../../helpers/lotHelpers';
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import makeServerRequest from '../../helpers/makeServerRequest';
import { recordSet } from '../../actions/record';

export const LotsList = React.memo(({ projectId, searchParams }) => {
  const { lots } = useSelector(state => state);

  const [displayLots, setDisplayLots] = useState([]);

  const { searchOrder, searchManzana, searchLot } = searchParams;

  const dispatch = useDispatch();

  useEffect(() => {
    let tempDispLots = lots.map(e => e);
    sortLotArray(tempDispLots);

    switch (searchOrder) {
      case 'higher':
        tempDispLots = tempDispLots
          .sort((a, b) => {
            return a.price - b.price;
          })
          .reverse();
        break;

      case 'lower':
        tempDispLots = tempDispLots.sort((a, b) => {
          return a.price - b.price;
        });
        break;

      case 'available':
        sortByState(tempDispLots, 'available');
        break;

      case 'reserved':
        sortByState(tempDispLots, 'reserved');
        break;

      case 'delivered':
        sortByState(tempDispLots, 'delivered');
        break;

      case 'liquidated':
        sortByState(tempDispLots, 'liquidated');
        break;
      default:
        break;
    }

    if (searchManzana) {
      tempDispLots = tempDispLots.filter(
        ({ manzana }) => manzana === +searchManzana
      );
    }

    if (searchLot) {
      tempDispLots = tempDispLots.filter(
        ({ lotNumber }) => lotNumber === +searchLot
      );
    }

    setDisplayLots(tempDispLots);
  }, [lots, searchOrder, searchManzana, searchLot]);

  const updateLot = async (_id, e) => {
    const localLot = lots.find(l => l._id === _id);

    dispatch(uiStartLoading());
    const [dbLot, info] = await fetchLot(_id);

    if (!dbLot) {
      console.log(info.error);
      dispatch(setTempError(info.message));
      e.preventDefault();
      return;
    }

    const recordId = dbLot.record?._id || localLot.record?._id;

    if (recordId) {
      const { record } = await makeServerRequest('/records/' + recordId);

      if (record) dispatch(recordSet(record));
    }

    dispatch(setLot(dbLot || localLot));
    dispatch(uiFinishLoading());
  };

  return (
    <div className='lot-list-container card__lot-list'>
      <div className='lot-list card'>
        <div className='headers'>
          <span>Status</span>
          <span>Manzana</span>
          <span>Número de lote</span>
          <span>Área</span>
          <span>precio</span>
        </div>

        <div className='scroll'>
          {displayLots.length > 0 ? (
            displayLots.map(
              ({ _id, manzana, lotNumber, area, price, state }, index) => {
                const stateName =
                  state === 'available'
                    ? 'Disponible'
                    : state === 'delivered'
                    ? 'Entregado'
                    : state === 'reserved'
                    ? 'Comprado'
                    : 'Liquidado';

                const dispPrice = price.toLocaleString();
                const dispArea = area.toLocaleString();
                const gray = (index + 1) % 2 === 0 ? true : false;

                return (
                  <Link
                    onClick={e => updateLot(_id, e)}
                    key={_id}
                    className={`item ${state} ${gray && 'gray'}`}
                    to={`./${projectId}/lote/${_id}`}>
                    <span className={state}>{stateName}</span>
                    <span>{manzana}</span>
                    <span>{lotNumber}</span>
                    <span>
                      {dispArea}m<sup>2</sup>
                    </span>
                    <span>${dispPrice}</span>
                  </Link>
                );
              }
            )
          ) : (
            <span className='empty'>No hay lotes para mostrar</span>
          )}
        </div>
      </div>
    </div>
  );
});
