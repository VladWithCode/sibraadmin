export const dateToReadableString = date => {
  if (Date(date).toString() === 'Invalid Date') return '';

  return Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  }).format(date);
};
