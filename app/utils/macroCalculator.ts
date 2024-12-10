export const macroCalculator = (
  weight: number,
  kcal_100g: number,
  proteins_100g: number,
  carbohydrates_100g: number,
  fat_100g: number,
  fiber_100g: number,
  sugars_100g: number
) => {
  const weightInGrams = weight / 100;
  const macros = {
    kcal: weightInGrams * kcal_100g,
    proteins: weightInGrams * proteins_100g,
    carbohydrates: weightInGrams * carbohydrates_100g,
    fat: weightInGrams * fat_100g,
    fiber: weightInGrams * fiber_100g,
    sugars: weightInGrams * sugars_100g,
  };

  return macros;
};

// export const macroCalculator = (
//   weight: number,
//   kcal_100g: number,
//   proteins_100g: number,
//   carbohydrates_100g: number,
//   fat_100g: number,
//   fiber_100g: number,
//   sugars_100g: number
// ) => {
//   const weightInGrams = weight / 100;
//   const macros = {
//     kcal: weightInGrams * kcal_100g,
//     proteins: weightInGrams * proteins_100g,
//     carbohydrates: weightInGrams * carbohydrates_100g,
//     fat: weightInGrams * fat_100g,
//     fiber: weightInGrams * fiber_100g,
//     sugars: weightInGrams * sugars_100g,
//   };

//   return macros;
// };
