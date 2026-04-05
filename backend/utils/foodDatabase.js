/**
 * AI Bio-Database: Nutritional values per 100g.
 */
const foodDatabase = [
    // PROTEINS
    { name: "Chicken Breast (Grilled)", calories: 165, protein: 31, carbs: 0, fat: 3.6, group: "Protein" },
    { name: "Chicken Thigh (Skinless)", calories: 209, protein: 26, carbs: 0, fat: 10.9, group: "Protein" },
    { name: "Salmon Fillet", calories: 208, protein: 20, carbs: 0, fat: 13, group: "Protein" },
    { name: "Beef (Ground) 90% Lean", calories: 176, protein: 20, carbs: 0, fat: 10, group: "Protein" },
    { name: "Egg (Large)", calories: 155, protein: 13, carbs: 1.1, fat: 11, group: "Protein" }, // Roughly 100g is 2 eggs
    { name: "Whey Protein (1 Scoop)", calories: 380, protein: 80, carbs: 8, fat: 3, group: "Protein" }, // Per 100g of powder
    { name: "Tofu (Firm)", calories: 144, protein: 16, carbs: 4.3, fat: 8.7, group: "Protein" },
    { name: "Greek Yogurt (Non-fat)", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, group: "Protein" },
    { name: "Lentils (Cooked)", calories: 116, protein: 9, carbs: 20, fat: 0.4, group: "Protein" },
    { name: "Tuna (Canned in Water)", calories: 116, protein: 26, carbs: 0, fat: 1, group: "Protein" },
    { name: "Cottage Cheese (Low-fat)", calories: 81, protein: 11, carbs: 4, fat: 2.3, group: "Protein" },
    { name: "Cod (Grilled)", calories: 105, protein: 23, carbs: 0, fat: 0.9, group: "Protein" },
    { name: "Pork Loin (Grilled)", calories: 242, protein: 27, carbs: 0, fat: 14, group: "Protein" },
    { name: "Shrimp (Boiled)", calories: 99, protein: 24, carbs: 0, fat: 0.3, group: "Protein" },

    // CARBS
    { name: "White Rice (Cooked)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, group: "Carbs" },
    { name: "Brown Rice (Cooked)", calories: 112, protein: 2.3, carbs: 24, fat: 0.8, group: "Carbs" },
    { name: "Oatmeal (Cooked in Water)", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, group: "Carbs" },
    { name: "Quinoa (Cooked)", calories: 120, protein: 4.4, carbs: 21, fat: 1.9, group: "Carbs" },
    { name: "Sweet Potato (Baked)", calories: 90, protein: 2, carbs: 21, fat: 0.1, group: "Carbs" },
    { name: "White Potato (Boiled)", calories: 87, protein: 2, carbs: 20, fat: 0.1, group: "Carbs" },
    { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, group: "Carbs" },
    { name: "Apple (with Skin)", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, group: "Carbs" },
    { name: "Blueberries (Fresh)", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, group: "Carbs" },
    { name: "Whole Wheat Bread", calories: 247, protein: 13, carbs: 41, fat: 3.4, group: "Carbs" },
    { name: "Pasta (Cooked)", calories: 158, protein: 5.8, carbs: 31, fat: 0.9, group: "Carbs" },
    { name: "Corn (Sweet)", calories: 86, protein: 3.2, carbs: 19, fat: 1.2, group: "Carbs" },
    { name: "Chickpeas (Cooked)", calories: 164, protein: 9, carbs: 27, fat: 2.6, group: "Carbs" },
    { name: "Rice Cake (Brown Rice)", calories: 387, protein: 8, carbs: 82, fat: 2.8, group: "Carbs" },

    // FATS
    { name: "Avocado", calories: 160, protein: 2, carbs: 8.5, fat: 15, group: "Fats" },
    { name: "Peanut Butter (Unsweetened)", calories: 588, protein: 25, carbs: 20, fat: 50, group: "Fats" },
    { name: "Almonds (Raw)", calories: 579, protein: 21, carbs: 22, fat: 50, group: "Fats" },
    { name: "Walnuts (Raw)", calories: 654, protein: 15, carbs: 14, fat: 65, group: "Fats" },
    { name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fat: 100, group: "Fats" },
    { name: "Cheddar Cheese", calories: 403, protein: 25, carbs: 1.3, fat: 33, group: "Fats" },
    { name: "Greek Salad Fet Cheese", calories: 264, protein: 14, carbs: 4, fat: 21, group: "Fats" },
    { name: "Chia Seeds", calories: 486, protein: 17, carbs: 42, fat: 31, group: "Fats" },
    { name: "Flax Seeds", calories: 534, protein: 18, carbs: 29, fat: 42, group: "Fats" },

    // MEALS / MIXED
    { name: "Protein Shake (Whey + Water)", calories: 120, protein: 24, carbs: 3, fat: 1, group: "Meals" },
    { name: "Salad (Mixed Greens)", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, group: "Meals" },
    { name: "Margarita Pizza (1 Slice)", calories: 266, protein: 11, carbs: 33, fat: 10, group: "Meals" },
    { name: "Beef Stir Fry", calories: 140, protein: 14, carbs: 6, fat: 7, group: "Meals" },
    { name: "Spaghetti Bolognese", calories: 130, protein: 7, carbs: 15, fat: 5, group: "Meals" }
];

module.exports = foodDatabase;
