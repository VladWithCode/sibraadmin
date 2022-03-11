import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { recordSet } from '../../actions/record';
import makeServerRequest from '../../helpers/makeServerRequest';

function CancelBtn({ action, onClick, recordId }) {
  const dispatch = useDispatch();

  const goto =
    action === 'request'
      ? `/historial/solicitar-reembolso/${recordId}`
      : `/historial/reembolsar/${recordId}`;
  const label =
    action === 'request' ? 'Solicitar Reembolso' : 'Entregar Reembolso';

  const _onClick = async e => {
    const res = await makeServerRequest('/records/' + recordId);

    dispatch(recordSet(res.record));

    return onClick(e);
  };

  return (
    <Link to={goto} onClick={_onClick} className='danger'>
      {label}
    </Link>
  );
}

export default CancelBtn;
