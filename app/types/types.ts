export type GlobalContextType = {
  scannedUPC: string;
  setScannedUPC: (upc: string) => void;
  UPCContent: ScanResult;
  setUPCContent: (upc: ScanResult) => void;
  dailyGoal: Macros;
  setDailyGoal: (goal: Macros) => void;

  setCurrentMacros: (macros: Macros) => void;
  currentMacros: Macros;

  macroLogs: Log[];
  setMacroLogs: (logs: Log[]) => void;
  setLastSaved: (date: string) => void;
};
export type firebaseUser = {
  email: string;
  username: string;
  profilePicUrl: string;
  lastActive: string | null;
  // uid: string;
  dailyGoal: DailyGoal;
  currentMacros: Macros;
  logs: Log[];
  bodyMetrics: {
    weight: number;
    height: number;
    age: number;
  };
  totalEatenCalories: number;
  totalEatenProtein: number;
  burnedCalories: number;
  consumption: Consumption;
};
export type Macros = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  date?: string;
};

export type DailyGoal = {
  calories: any;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
};

export type Consumption = {
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbohydrates: number;
  consumedFat: number;
  consumedFiber: number;
  consumedSugar: number;
};

export type nutriments = {
  carbohydrates: number;
  carbohydrates_100g: number;
  carbohydrates_unit: string;
  carbohydrates_value: number;
  energy: number;
  "energy-kcal": number;
  "energy-kcal_100g": number;
  "energy-kcal_unit": string;
  "energy-kcal_value": number;
  "energy-kcal_value_computed": number;
  "energy-kj": number;
  "energy-kj_100g": number;
  "energy-kj_unit": string;
  "energy-kj_value": number;
  "energy-kj_value_computed": number;
  energy_100g: number;
  energy_unit: string;
  energy_value: number;
  fat: number;
  fat_100g: number;
  fat_unit: string;
  fat_value: number;
  fiber: number;
  fiber_100g: number;
  fiber_unit: string;
  fiber_value: number;
  "fruits-vegetables-legumes-estimate-from-ingredients_100g": number;
  "fruits-vegetables-legumes-estimate-from-ingredients_serving": number;
  "fruits-vegetables-nuts-estimate-from-ingredients_100g": number;
  "fruits-vegetables-nuts-estimate-from-ingredients_serving": number;
  "nova-group": number;
  "nova-group_100g": number;
  "nova-group_serving": number;
  "nutrition-score-fr": number;
  "nutrition-score-fr_100g": number;
  proteins: number;
  proteins_100g: number;
  proteins_unit: string;
  proteins_value: number;
  salt: number;
  salt_100g: number;
  salt_unit: string;
  salt_value: number;
  "saturated-fat": number;
  "saturated-fat_100g": number;
  "saturated-fat_unit": string;
  "saturated-fat_value": number;
  sodium: number;
  sodium_100g: number;
  sodium_unit: string;
  sodium_value: number;
  sugars: number;
  sugars_100g: number;
  sugars_unit: string;
  sugars_value: number;
};

export type Product = {
  nutriments?: Partial<nutriments>;
  product_name: string;
  brands: string;
};

export type ScanResult = {
  code: string;
  product: Product;
  //   product: {
  //     nutriments: any;
  //   };
  //   product: {
  //     nutriments: nutriments;
  //   };
};

export type Log = {
  calories: any;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  burnedCalories: number;
  date: string;
};
