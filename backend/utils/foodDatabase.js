/**
 * AI Bio-Database: Nutritional values per 100g.
 * Sourced/Standardized based on USDA FoodData Central (FDC) and nutritional standards.
 */
const foodDatabase = [
    // PROTEINS (High Density)
    { name: "Chicken Breast (Grilled)", calories: 165, protein: 31, carbs: 0, fat: 3.6, group: "Protein" },
    { name: "Chicken Thigh (Skinless)", calories: 209, protein: 26, carbs: 0, fat: 10.9, group: "Protein" },
    { name: "Turkey Breast (Roasted)", calories: 135, protein: 30, carbs: 0, fat: 0.7, group: "Protein" },
    { name: "Beef (Ground) 90% Lean", calories: 176, protein: 20, carbs: 0, fat: 10, group: "Protein" },
    { name: "Beef (Sirloin Steak)", calories: 244, protein: 27, carbs: 0, fat: 15, group: "Protein" },
    { name: "Pork Loin (Grilled)", calories: 242, protein: 27, carbs: 0, fat: 14, group: "Protein" },
    { name: "Salmon Fillet (Baked)", calories: 208, protein: 20, carbs: 0, fat: 13, group: "Protein" },
    { name: "Cod (Grilled)", calories: 105, protein: 23, carbs: 0, fat: 0.9, group: "Protein" },
    { name: "Tuna (Canned in Water)", calories: 116, protein: 26, carbs: 0, fat: 1, group: "Protein" },
    { name: "Shrimp (Boiled)", calories: 99, protein: 24, carbs: 0, fat: 0.3, group: "Protein" },
    { name: "Egg (Large, Boiled)", calories: 155, protein: 13, carbs: 1.1, fat: 11, group: "Protein" },
    { name: "Egg Whites", calories: 52, protein: 11, carbs: 0.7, fat: 0.2, group: "Protein" },
    { name: "Greek Yogurt (Non-fat)", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, group: "Protein" },
    { name: "Greek Yogurt (Full Fat)", calories: 97, protein: 9, carbs: 4, fat: 5, group: "Protein" },
    { name: "Cottage Cheese (Low-fat)", calories: 81, protein: 11, carbs: 4, fat: 2.3, group: "Protein" },
    { name: "Tofu (Firm)", calories: 144, protein: 16, carbs: 4.3, fat: 8.7, group: "Protein" },
    { name: "Tempeh", calories: 193, protein: 18, carbs: 9, fat: 11, group: "Protein" },
    { name: "Whey Protein (Powder)", calories: 380, protein: 80, carbs: 8, fat: 3, group: "Protein" },
    { name: "Casein Protein (Powder)", calories: 370, protein: 85, carbs: 2, fat: 1.5, group: "Protein" },
    { name: "Lentils (Cooked)", calories: 116, protein: 9, carbs: 20, fat: 0.4, group: "Protein" },
    { name: "Chickpeas (Cooked)", calories: 164, protein: 9, carbs: 27, fat: 2.6, group: "Protein" },

    // DAIRY & MILK (Special Bio-Fuel)
    { name: "Whole Milk", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, group: "Dairy" },
    { name: "Skim Milk (Non-fat)", calories: 34, protein: 3.4, carbs: 5, fat: 0.1, group: "Dairy" },
    { name: "Almond Milk (Unsweetened)", calories: 15, protein: 0.5, carbs: 0.3, fat: 1.1, group: "Dairy" },
    { name: "Soy Milk (Unsweetened)", calories: 33, protein: 3.3, carbs: 1.8, fat: 1.9, group: "Dairy" },
    { name: "Oat Milk (Unsweetened)", calories: 45, protein: 1, carbs: 7, fat: 1.5, group: "Dairy" },
    { name: "Yogurt (Plain)", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, group: "Dairy" },
    { name: "Kefir (Plain)", calories: 41, protein: 3.3, carbs: 3.1, fat: 1.5, group: "Dairy" },

    // CARBS (Energy Sources)
    { name: "White Rice (Cooked)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, group: "Carbs" },
    { name: "Brown Rice (Cooked)", calories: 112, protein: 2.3, carbs: 24, fat: 0.8, group: "Carbs" },
    { name: "Basmati Rice (Cooked)", calories: 121, protein: 3.5, carbs: 25, fat: 0.4, group: "Carbs" },
    { name: "Quinoa (Cooked)", calories: 120, protein: 4.4, carbs: 21, fat: 1.9, group: "Carbs" },
    { name: "Oatmeal (Cooked in Water)", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, group: "Carbs" },
    { name: "Dry Oats (Rolled)", calories: 389, protein: 16.9, carbs: 66, fat: 6.9, group: "Carbs" },
    { name: "Sweet Potato (Baked)", calories: 90, protein: 2, carbs: 21, fat: 0.1, group: "Carbs" },
    { name: "White Potato (Boiled)", calories: 87, protein: 2, carbs: 20, fat: 0.1, group: "Carbs" },
    { name: "Pasta (Wheat, Cooked)", calories: 158, protein: 5.8, carbs: 31, fat: 0.9, group: "Carbs" },
    { name: "Whole Wheat Bread", calories: 247, protein: 13, carbs: 41, fat: 3.4, group: "Carbs" },
    { name: "White Bread", calories: 265, protein: 9, carbs: 49, fat: 3.2, group: "Carbs" },
    { name: "Sourdough Bread", calories: 289, protein: 12, carbs: 56, fat: 1.8, group: "Carbs" },
    { name: "Rice Cake (Plain)", calories: 387, protein: 8, carbs: 82, fat: 2.8, group: "Carbs" },
    { name: "Couscous (Cooked)", calories: 112, protein: 3.8, carbs: 23, fat: 0.2, group: "Carbs" },
    { name: "Corn (Sweet, Cooked)", calories: 86, protein: 3.2, carbs: 19, fat: 1.2, group: "Carbs" },

    // FATS (Essential Lipids)
    { name: "Avocado", calories: 160, protein: 2, carbs: 8.5, fat: 15, group: "Fats" },
    { name: "Olive Oil", calories: 884, protein: 0, carbs: 0, fat: 100, group: "Fats" },
    { name: "Coconut Oil", calories: 862, protein: 0, carbs: 0, fat: 100, group: "Fats" },
    { name: "Butter (Unsalted)", calories: 717, protein: 0.9, carbs: 0.1, fat: 81, group: "Fats" },
    { name: "Peanut Butter (Natural)", calories: 588, protein: 25, carbs: 20, fat: 50, group: "Fats" },
    { name: "Almonds (Raw)", calories: 579, protein: 21, carbs: 22, fat: 50, group: "Fats" },
    { name: "Walnuts (Raw)", calories: 654, protein: 15, carbs: 14, fat: 65, group: "Fats" },
    { name: "Cashews (Raw)", calories: 553, protein: 18, carbs: 30, fat: 44, group: "Fats" },
    { name: "Chia Seeds", calories: 486, protein: 17, carbs: 42, fat: 31, group: "Fats" },
    { name: "Flax Seeds", calories: 534, protein: 18, carbs: 29, fat: 42, group: "Fats" },
    { name: "Cheddar Cheese", calories: 403, protein: 25, carbs: 1.3, fat: 33, group: "Fats" },
    { name: "Feta Cheese", calories: 264, protein: 14, carbs: 4, fat: 21, group: "Fats" },

    // FRUITS (Vitamins & Simple Carbs)
    { name: "Apple (with Skin)", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, group: "Fruits" },
    { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, group: "Fruits" },
    { name: "Blueberries", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, group: "Fruits" },
    { name: "Strawberries", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, group: "Fruits" },
    { name: "Orange", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, group: "Fruits" },
    { name: "Mango", calories: 60, protein: 0.8, carbs: 15, fat: 0.4, group: "Fruits" },
    { name: "Pineapple", calories: 50, protein: 0.5, carbs: 13, fat: 0.1, group: "Fruits" },
    { name: "Grapefruit", calories: 42, protein: 0.8, carbs: 11, fat: 0.1, group: "Fruits" },
    { name: "Watermelon", calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, group: "Fruits" },

    // VEGETABLES (Micronutrients & Fiber)
    { name: "Broccoli (Raw)", calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, group: "Vegetables" },
    { name: "Spinach (Raw)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, group: "Vegetables" },
    { name: "Kale (Raw)", calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, group: "Vegetables" },
    { name: "Asparagus", calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, group: "Vegetables" },
    { name: "Carrot (Raw)", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, group: "Vegetables" },
    { name: "Bell Pepper (Red)", calories: 31, protein: 1, carbs: 6, fat: 0.3, group: "Vegetables" },
    { name: "Cucumber (with Peel)", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, group: "Vegetables" },
    { name: "Zucchini (Raw)", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, group: "Vegetables" },
    { name: "Mushrooms (White)", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, group: "Vegetables" },
    { name: "Green Beans (Boiled)", calories: 35, protein: 1.9, carbs: 7.9, fat: 0.3, group: "Vegetables" },

    // MEALS / MIXED
    { name: "Pizza (Margarita, 1 Slice)", calories: 266, protein: 11, carbs: 33, fat: 10, group: "Meals" },
    { name: "Beef Stir Fry", calories: 140, protein: 14, carbs: 6, fat: 7, group: "Meals" },
    { name: "Spaghetti Bolognese", calories: 130, protein: 7, carbs: 15, fat: 5, group: "Meals" },
    { name: "Salad (Mixed Greens)", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, group: "Meals" },
    { name: "Protein Shake (Whey + Water)", calories: 120, protein: 24, carbs: 3, fat: 1, group: "Meals" },
    { name: "Hummus", calories: 166, protein: 8, carbs: 14, fat: 10, group: "Meals" },
    { name: "Guacamole", calories: 157, protein: 2, carbs: 9, fat: 15, group: "Meals" }
];

module.exports = foodDatabase;
