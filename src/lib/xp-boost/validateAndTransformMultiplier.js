module.exports = function validateAndTransformMultiplier(multiplier) {
  const multiplierRegex = /^(((?:100|[1-9]\d?)%?))$/;

  if (multiplierRegex.test(multiplier)) {
    if (multiplier.includes('%')) multiplier = multiplier.replace('%', '');

    const multiplierNumber = Number(multiplier);

    if (multiplierNumber >= 1 && multiplierNumber <= 100) {
      return ((multiplierNumber / 100) + 1).toFixed(2);
    }
  }

  return null;
}