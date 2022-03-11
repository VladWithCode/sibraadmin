export const sortLotArray = lots => {
  lots.sort((a, b) => a.manzana - b.manzana || a.lotNumber - b.lotNumber);
};

export const sortByState = (lots, state) => {
  lots.sort((a, b) => {
    if (a.state === state) return -1;

    if (b.state === state) return 1;

    return (
      +a.state.localeCompare(b.state) ||
      a.manzana - b.manzana ||
      a.lotNumber - b.lotNumber
    );
  });
};

export const getCessionInfo = lot => {
  if (lot.cessions.length === 0) return false;

  return lot.cessions[0];
};
