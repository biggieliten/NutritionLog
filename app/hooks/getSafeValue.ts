export const getSafeValue = (a: number | undefined | null) => {
  if (!a || a === undefined) return 0;
  if (isNaN(a)) return 0;

  return a;
};

export const calculateSafeSum = (a: number, b: number) => {
  if (isNaN(a)) return 0;
  if (isNaN(b)) return 0;
  return a + b;
};
