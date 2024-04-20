function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFloat(min, max, decimalPlaces) {
  const randomNum = Math.random() * (max - min) + min;
  return parseFloat(randomNum.toFixed(decimalPlaces));
}

module.exports = {getRandomFloat, getRndInteger}