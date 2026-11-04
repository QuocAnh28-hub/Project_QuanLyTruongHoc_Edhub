export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function toRomanNumeral(num: number) {
  if (!num || isNaN(num) || num < 1 || num > 3999) {
    return num;
  }

  const lookup = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4],
    ['I', 1]
  ];

  let roman = '';
  for (const [symbol, value] of lookup) {
    const val = Number(value)
    while (num >= val) {
      roman += symbol;
      num -= val;
    }
  }
  return roman;
};