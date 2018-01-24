// yyyy-mm-dd
function fmtDate (dateIn) {
  dateIn = dateIn || Date.now();
  var parsedDate = new Date(dateIn);
  return parsedDate.getFullYear() + '-' + (parsedDate.getMonth() + 1) + '-' + parsedDate.getDate();
}

// hh:mm:ss
function fmtTime (dateIn) {
  dateIn = dateIn || Date.now();
  var parsedDate = new Date(dateIn);
  return parsedDate.getHours() + ':' + parsedDate.getMinutes() + ':' + parsedDate.getSeconds();
}

module.exports = {
  date: fmtDate,
  time: fmtTime
};
