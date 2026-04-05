const exercisePools = {
  lose_weight: [
    { name: 'High Knees', sets: '3', reps: '45 seconds', rest: '15s' },
    { name: 'Jumping Jacks', sets: '3', reps: '1 minute', rest: '20s' },
    { name: 'Mountain Climbers', sets: '4', reps: '30 seconds', rest: '10s' },
    { name: 'Burpees', sets: '3', reps: '10 reps', rest: '30s' },
    { name: 'Jump Rope', sets: '3', reps: '2 minutes', rest: '30s' },
    { name: 'Bicycle Crunches', sets: '3', reps: '20 reps/side', rest: '15s' },
    { name: 'Treadmill Sprint', sets: '1', reps: '10 minutes', rest: 'None' },
    { name: 'Kettlebell Swings', sets: '4', reps: '20 reps', rest: '30s' }
  ],
  gain_muscle: [
    { name: 'Push-ups', sets: '4', reps: 'To failure', rest: '60s' },
    { name: 'Bodyweight Squats', sets: '4', reps: '15 reps', rest: '45s' },
    { name: 'Dumbbell Rows', sets: '3', reps: '12 reps', rest: '60s' },
    { name: 'Overhead Press', sets: '4', reps: '10 reps', rest: '60s' },
    { name: 'Pull-ups', sets: '3', reps: 'To failure', rest: '90s' },
    { name: 'Lunges', sets: '3', reps: '12 reps/leg', rest: '45s' },
    { name: 'Plank Hold', sets: '3', reps: '60 seconds', rest: '30s' },
    { name: 'Romanian Deadlifts', sets: '4', reps: '10 reps', rest: '90s' }
  ],
  maintain: [
    { name: 'Light Jogging', sets: '1', reps: '15 minutes', rest: 'None' },
    { name: 'Push-ups', sets: '3', reps: '15 reps', rest: '45s' },
    { name: 'Squats', sets: '3', reps: '20 reps', rest: '30s' },
    { name: 'Yoga Flow', sets: '1', reps: '10 minutes', rest: 'None' },
    { name: 'Core Plank', sets: '3', reps: '45 seconds', rest: '30s' },
    { name: 'Russian Twists', sets: '3', reps: '20 reps', rest: '20s' },
    { name: 'Incline Walk', sets: '1', reps: '20 minutes', rest: 'None' }
  ]
};

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generate30DayWorkout = (goal) => {
  const plan = [];
  const pool = exercisePools[goal] || exercisePools.maintain;

  for (let i = 1; i <= 30; i++) {
    // Every 7 days is a strict active recovery day
    if (i % 7 === 0) {
      plan.push({
        dayNumber: i,
        title: 'Active Recovery Protocol',
        type: 'Recovery',
        exercises: [
          { id: `d${i}_e1`, name: 'Casual Walking', sets: '1', reps: '30 mins', rest: 'None', instructions: ['Maintain low heart rate.', 'Nasal breathing only.'] },
          { id: `d${i}_e2`, name: 'Mobility Stretch Routine', sets: '1', reps: '15 mins', rest: 'None', instructions: ['Focus on tight areas.', 'Do not push into pain.'] }
        ]
      });
      continue;
    }

    // Number of exercises increases as the month progresses
    let numExercises = 3;
    if (i > 10) numExercises = 4;
    if (i > 20) numExercises = 5;

    const selectedExercises = getRandomItems(pool, numExercises);
    
    // Scale sets/reps up slightly on final sequence (Progressive Overload simulation)
    const scaledExercises = selectedExercises.map((ex, idx) => {
        let newSets = parseInt(ex.sets);
        if (i > 15 && !isNaN(newSets)) newSets += 1; 
        
        return {
            id: `d${i}_e${idx}`, // Unique ID for tracking individual completions
            name: ex.name,
            sets: `${newSets || ex.sets}`,
            reps: ex.reps,
            rest: ex.rest,
            instructions: ['Focus on eccentric control.', `Strictly observe rest periods: ${ex.rest}.`]
        };
    });

    const phase = Math.ceil(i/10);
    const titleObj = goal === 'lose_weight' ? 'Metabolic Conditioning' : goal === 'gain_muscle' ? 'Hypertrophy Overload' : 'Homeostatic Balance';

    plan.push({
      dayNumber: i,
      title: `${titleObj} - Phase ${phase}`,
      type: goal === 'lose_weight' ? 'Cardio / HIIT' : goal === 'gain_muscle' ? 'Strength' : 'Balanced',
      exercises: scaledExercises
    });
  }

  return plan;
};
