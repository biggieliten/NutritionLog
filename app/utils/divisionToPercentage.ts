export const divisionToPercentage = (
  numerator: number,
  denominator: number
) => {
  return Math.round((numerator / denominator) * 100);
};
