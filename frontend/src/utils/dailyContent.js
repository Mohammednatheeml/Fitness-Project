export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getBmiStatus = (bmi) => {
  if (!bmi || bmi === 0) return 'healthy';
  const b = parseFloat(bmi);
  if (b < 18.5) return 'underweight';
  if (b < 25.0) return 'healthy';
  if (b < 30.0) return 'overweight';
  return 'obese';
};

export const getIdealWeightRange = (height) => {
  if (!height || height === 0) return { min: 0, max: 0 };
  const hMeters = height / 100;
  return {
    min: Math.round(18.5 * (hMeters * hMeters)),
    max: Math.round(24.9 * (hMeters * hMeters))
  };
};

export const getWeightStatusColor = (status) => {
  switch (status) {
    case 'underweight': return '#38bdf8'; // Sky blue
    case 'healthy': return '#10b981';     // Emerald green
    case 'overweight': return '#f59e0b';  // Amber
    case 'obese': return '#ef4444';       // Rose red
    default: return '#10b981';
  }
};

export const getStatusLabel = (status) => {
  const labels = {
    underweight: 'Underweight',
    healthy: 'Normal Weight',
    overweight: 'Overweight',
    obese: 'Obese'
  };
  return labels[status] || labels.healthy;
};

// Workout data has been offloaded to workoutEngine.js for dynamic generation

// Diet data moved to dietEngine.js for 30-day dynamic generation.

const recoveryAdvice = {
  obese: 'Focus on 7 hours. Body needs higher recovery time due to metabolic load. Nasal breathing recommended.',
  underweight: 'Mandatory 9 hours. Growth hormone peaks during deep sleep. Crucial for hypertrophy.',
  healthy: 'Standard 8 hours. Maintain circadian rhythm for hormonal balance.',
  overweight: '8 hours required. Focus on sleep quality to regulate cortisol and hunger hormones.'
};

export const getSleepAdvice = (status) => {
  return recoveryAdvice[status] || recoveryAdvice.healthy;
};

export const getSmartInsight = (status, goal, age, gender) => {
  let text = '';
  let title = '';

  if (status === 'underweight') {
    title = 'Underweight Protocol';
    text = 'You need a calorie surplus and a nutrient-rich diet to build mass safely.';
  } else if (status === 'healthy') {
    title = 'Target Weight Achieved';
    text = 'Maintain your current lifestyle and balanced diet to preserve health parameters.';
  } else if (status === 'overweight') {
    title = 'Overweight Protocol';
    text = 'A moderate calorie deficit and moderately increased activity are suggested.';
  } else if (status === 'obese') {
    title = 'Obese Protocol';
    text = 'A structured diet plan and medical-level consultation are recommended for safe reduction.';
  } else {
    title = 'System Homeostasis';
    text = 'Maintain protocol consistency.';
  }

  // Refinements based on demographic
  if (gender && gender.toLowerCase() === 'female') {
    text += ' Ensure adequate protein intake considering natural muscle mass ratios in females.';
  }

  if (age) {
    const ageNum = parseInt(age);
    if (ageNum > 40) {
      text += ' Consider slower metabolism adjustments and focus on joint-friendly recovery.';
    } else if (ageNum < 30) {
      text += ' Suggestion: Integrate a more active lifestyle and intensive workouts to maximize metabolic peak.';
    }
  }

  return { title, text };
};
