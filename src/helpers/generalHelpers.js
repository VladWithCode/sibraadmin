const generalHelpers = {};

export const priceToString = p => {
  if (!p || !+p || typeof p !== 'number') return p;

  const [i, d] = (+p).toFixed(2).split('.');

  return `${(+i).toLocaleString()}.${d}`;
};

export const safeRound = n => {
  if (Number(n) === NaN) return n;

  return Math.round(n * 100) / 100;
};
