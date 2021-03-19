function leadZero(num) {
  const size = 2;
  num = num.toString();
  while (num.length < size) num = `0${num}`;
  return num;
}

/**
 * Formats the date-time string
 * @input inputDate Date
 * @return String yyyy-mm-dd hh:mm:ss
 */
function formatDateTimeString(inputDate) {
  console.log('inputDate', inputDate);
  inputDate = inputDate || Date.now();
  const d = new Date(inputDate);
  const dateString = `${d.getFullYear()}-${leadZero(d.getMonth() + 1)}-${leadZero(d.getDate())}`;
  const timeString = `${leadZero(d.getHours())}:${leadZero(d.getMinutes())}:${leadZero(d.getSeconds())}`;
  return `${dateString} ${timeString}`;
}

function stringifyJson(inputJson) {
  return JSON.stringify(inputJson, null, 2);
}

module.exports = {
  formatDateTimeString,
  stringifyJson,
};
