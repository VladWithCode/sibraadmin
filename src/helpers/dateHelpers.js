export const dateToReadableString = date => {
  if (!Date.parse(date)) return '';

  return Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  }).format(date);
};
