export const getTicketTime = (time: number) => {
  const currentDate = new Date().getTime();
  const ticketDate = new Date(time).getTime();

  const diff = ((currentDate - ticketDate) / 1000) / 60;

  if (diff > 518400) {
    return `${Math.round(diff / 43200)} year/s ago`;
  } else if (diff > 43200) {
    return `${Math.round(diff / 43200)} month/s ago`;
  } else if (diff > 1440) {
    return `${Math.round(diff / 1440)} day/s ago`;
  } else if (diff > 60) {
    return `${Math.round(diff / 60)} hour/s ago`;
  } else if (Math.abs(Math.round(diff)) >= 1) {
    return `${Math.abs(Math.round(diff))} minutes ago`;
  } else {
    return 'just now';
  }
}