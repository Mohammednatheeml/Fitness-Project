const foodDatabase = {
  breakfast: [
    { name: 'Oatmeal with Almonds & Mixed Berries', type: 'carb' },
    { name: 'Scrambled Eggs (4) with Avocado on Sourdough', type: 'balanced' },
    { name: 'Greek Yogurt (2%) with Whey Protein & Chia', type: 'protein' },
    { name: 'Protein Pancakes with Sugar-Free Syrup', type: 'protein' },
    { name: 'Tofu Scramble with Spinach & Mushrooms', type: 'balanced' },
    { name: 'Smoked Salmon Bagel with Dill Cream Cheese', type: 'fat' },
    { name: 'Protein Smoothie Bowl with Seeds & Nuts', type: 'balanced' }
  ],
  lunch: [
    { name: 'Grilled Chicken Breast with Quinoa & Broccoli', type: 'protein' },
    { name: 'Salmon Salad with Olive Oil Vinaigrette', type: 'fat' },
    { name: 'Turkey Wrap with Spinach, Hummus & Feta', type: 'balanced' },
    { name: 'Lentil Soup with a side of Mixed Greens', type: 'carb' },
    { name: 'Lean Beef Mince with Roasted Sweet Potato', type: 'protein' },
    { name: 'Chicken Fajita Bowl (No Tortilla, Extra Veg)', type: 'protein' },
    { name: 'Tuna Salad on Whole Wheat Bread', type: 'balanced' }
  ],
  dinner: [
    { name: 'Baked Cod with Roasted Asparagus & Lemon', type: 'protein' },
    { name: 'Sirloin Steak with Broccoli & Brown Rice', type: 'balanced' },
    { name: 'Chicken Stir-fry with Shirataki Noodles', type: 'protein' },
    { name: 'Tofu Curry with Cauliflower Rice', type: 'fat' },
    { name: 'Shrimp Tacos on Corn Tortillas with Slaw', type: 'balanced' },
    { name: 'Turkey Meatballs with Zucchini Noodles', type: 'protein' },
    { name: 'Grilled Pork Chop with Green Beans & Mash', type: 'balanced' }
  ],
  snack: [
    { name: 'Handful of Mixed Almonds and Walnuts', type: 'fat' },
    { name: 'Whey Protein Shake (with Water)', type: 'protein' },
    { name: 'Apple Slices with Peanut Butter', type: 'balanced' },
    { name: 'Cottage Cheese with Pineapple Chunks', type: 'protein' },
    { name: 'Two Hard-Boiled Eggs', type: 'fat' },
    { name: 'Rice Cakes with Almond Butter', type: 'balanced' },
    { name: 'Carrot Sticks with Hummus', type: 'carb' }
  ]
};

const getRandomItem = (arr, previousItem) => {
  let item;
  do {
    item = arr[Math.floor(Math.random() * arr.length)];
  } while (arr.length > 1 && previousItem && item.name === previousItem.name);
  return item;
};

export const generate30DayPlan = (targetCalories, goal) => {
  const plan = [];

  // Macronutrient macro ratio hints based on goal
  let macroHint = "";
  if (goal === 'lose_weight') {
     macroHint = "High Protein / Low Carb / Moderate Fat Protocol";
  } else if (goal === 'gain_muscle') {
     macroHint = "High Protein / High Carb / Safe Fat Protocol";
  } else {
     macroHint = "Balanced Protein / Carb / Fat Protocol";
  }

  // Calorie Distribution
  const calsBreakfast = Math.round(targetCalories * 0.25);
  const calsLunch = Math.round(targetCalories * 0.35);
  const calsDinner = Math.round(targetCalories * 0.30);
  const calsSnack = Math.round(targetCalories * 0.10);

  let prevB = null, prevL = null, prevD = null, prevS = null;

  for (let i = 1; i <= 30; i++) {
    const b = getRandomItem(foodDatabase.breakfast, prevB);
    const l = getRandomItem(foodDatabase.lunch, prevL);
    const d = getRandomItem(foodDatabase.dinner, prevD);
    const s = getRandomItem(foodDatabase.snack, prevS);

    prevB = b; prevL = l; prevD = d; prevS = s;

    plan.push({
      dayNumber: i,
      completed: false,
      totalCalories: targetCalories,
      macroHint: macroHint,
      meals: {
        breakfast: { name: b.name, calories: calsBreakfast },
        lunch: { name: l.name, calories: calsLunch },
        dinner: { name: d.name, calories: calsDinner },
        snack: { name: s.name, calories: calsSnack }
      }
    });
  }

  return plan;
};
