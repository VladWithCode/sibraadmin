export const priceToString = p => {
  if (!p || !+p || typeof p !== 'number') return p;

  const [i, d] = (+p).toFixed(2).split('.');

  return `${(+i).toLocaleString()}.${d}`;
};

export const safeRound = n => {
  if (Number.isNaN(n)) return n;

  return Math.round(n * 100) / 100;
};

export const isEmptyObject = o => {
  if (!o) return true;

  return !(Object.keys(o).length > 0);
};
