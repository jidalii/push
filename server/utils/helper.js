function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFloat(min, max, decimalPlaces) {
  const randomNum = Math.random() * (max - min) + min;
  return parseFloat(randomNum.toFixed(decimalPlaces));
}

function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function setRandomTimeWithinRange(
  date,
  minHour,
  maxHour,
  minMinute,
  maxMinute
) {
  let newDate = new Date(date.setHours(0, 0, 0, 0));
  newDate.setHours(
    getRndInteger(minHour, maxHour),
    getRndInteger(minMinute, maxMinute),
    getRndInteger(0, 59),
    getRndInteger(0, 999)
  );
  return newDate;
}

module.exports = {
  getRandomFloat,
  getRndInteger,
  addDays,
  setRandomTimeWithinRange,
};
