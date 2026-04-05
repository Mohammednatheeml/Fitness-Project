import React, { useState } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

const Calories = () => {
  const [food, setFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('http://localhost:5000/calories', food, config);
      alert("Food logged successfully!");
      setFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    } catch (error) {
      alert("Error logging food.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-10">
      <header className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold neon-text-gradient bg-clip-text text-transparent inline-block">Log Your Meal</h1>
        <p className="text-on-surface-variant font-body mt-2">Every calorie counts. Stay on track.</p>
      </header>

      <GlassCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6 font-body">
          <input
            type="text"
            placeholder="Food Name (e.g., Grilled Chicken)"
            className="w-full bg-surface-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-background focus:outline-none focus:border-primary/50 transition-colors"
            value={food.name}
            onChange={(e) => setFood({...food, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Calories (kcal)"
              className="w-full bg-surface-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-background focus:outline-none focus:border-primary/50 transition-colors"
              value={food.calories}
              onChange={(e) => setFood({...food, calories: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Protein (g)"
              className="w-full bg-surface-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-background focus:outline-none focus:border-primary/50 transition-colors"
              value={food.protein}
              onChange={(e) => setFood({...food, protein: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Carbs (g)"
              className="w-full bg-surface-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-background focus:outline-none focus:border-primary/50 transition-colors"
              value={food.carbs}
              onChange={(e) => setFood({...food, carbs: e.target.value})}
            />
            <input
              type="number"
              placeholder="Fat (g)"
              className="w-full bg-surface-low border border-outline-variant/30 rounded-xl px-4 py-3 text-on-background focus:outline-none focus:border-primary/50 transition-colors"
              value={food.fat}
              onChange={(e) => setFood({...food, fat: e.target.value})}
            />
          </div>
          <NeonButton type="submit" className="w-full mt-4">Log Food</NeonButton>
        </form>
      </GlassCard>
    </div>
  );
};

export default Calories;
