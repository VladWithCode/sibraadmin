export const dateToReadableString = date => {
  if (!Date.parse(date)) return '';

  const d = new Date(date);

  return Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  }).format(d);
};
