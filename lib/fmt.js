// yyyy-mm-dd
function fmtDate (dateIn) {
  dateIn = dateIn || Date.now();
  const parsedDate = new Date(dateIn);
  return `${parsedDate.getFullYear()}-${parsedDate.getMonth() + 1}-${parsedDate.getDate()}`;
}

// hh:mm:ss
function fmtTime (dateIn) {
  dateIn = dateIn || Date.now();
  const parsedDate = new Date(dateIn);
  return `${parsedDate.getHours()}:${parsedDate.getMinutes()}:${parsedDate.getSeconds()}`;
}

function timestampNow() {
  return `${fmtDate()} ${fmtTime()}`;
}

module.exports = {
  date: fmtDate,
  time: fmtTime,
  timestampNow,
};
