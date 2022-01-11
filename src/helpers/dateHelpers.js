export const dateToReadableString = date => {
  Intl.DateTimeFormat('ex-MX', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  }).format(date);
};
