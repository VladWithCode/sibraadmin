import { id } from 'date-fns/locale';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { recordSet } from '../../actions/record';
import makeServerRequest from '../../helpers/makeServerRequest';

function CessionBtn({ action, onClick, recordId }) {
  const dispatch = useDispatch();

  const goto =
    action === 'request'
      ? `/historial/solicitar-cesion/${recordId}`
      : `/historial/ceder/${recordId}`;
  const label = action === 'request' ? 'Solicitar Cesión' : 'Completar Cesión';

  const _onClick = async e => {
    const res = await makeServerRequest('/records/' + recordId);

    dispatch(recordSet(res.record));

    return onClick(e);
  };

  return (
    <Link to={goto} onClick={_onClick} className='text-warning'>
      {label}
    </Link>
  );
}

export default CessionBtn;
