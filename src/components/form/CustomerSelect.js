import React, { useState } from 'react';

function CustomerSelect({
  customers,
  customer,
  setCustomer,
  handleNewCustomer,
}) {
  const [newCustomer, setNewCustomer] = await useState(null);

  return (
    <select
      onChange={e => {
        const { target } = e;
        if (target.value === 'add') {
          handleNewCustomer(newCustomer, setNewCustomer, setCustomer);

          return;
        }
        setCustomer(customers.find(c => c._id === target.value));
        return;
      }}
      name='customer'
      id='customer'
      value={newCustomer?._id || customer?._id}>
      <option value key='blankOpt'>
        &nbsp;
      </option>
      <option value='add' key='addOpt'>
        Agregar Cliente
      </option>
      {customers?.map(c => {
        return (
          <option key={c._id} value={c._id}>
            {c.fullName}
          </option>
        );
      })}
      {newCustomer && (
        <option key={newCustomer._id} value={newCustomer._id} selected>
          {newCustomer.fullName}
        </option>
      )}
    </select>
  );
}

export default CustomerSelect;
