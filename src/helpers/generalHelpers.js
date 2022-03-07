const generalHelpers = {};

generalHelpers.priceToString = p => {
  if (!p || !+p || typeof p !== 'number') return p;

  const [i, d] = (+p).toFixed(2).split('.');

  return `${(+i).toLocaleString()}.${d}`;
};

export default generalHelpers;
