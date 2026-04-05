/**
 * AI Coach NLP Engine (Simulated Python-style pattern matching)
 * Handles intent classification using keyword density and fuzzy matching.
 */

const intents = {
  GREETING: {
    keywords: ["hello", "hi", "hey", "hola", "coach", "morning", "evening", "sup", "yo", "greetings", "howdy", "what's up", "whats up", "good day"],
    responses: [
      "Hey! Coach here. Ready to smash some goals today?",
      "Hello! Great to see you back. What's on the training agenda?",
      "Coach is in the building! How's your energy level feeling right now?",
      "Hi there! Let's get that metabolism firing. What can I help with?",
      "Yo! Your coach is locked in. What are we working on today?",
      "Good to have you back! Did you hydrate this morning yet? Let's talk goals.",
      "Hey champion! Every day you show up is a victory. What's the plan?",
      "Morning warrior! Your body is ready. Is your mind?",
      "What's up! Let's build something great today. Diet, training, or mindset — where do we start?"
    ]
  },
  PROTEIN: {
    keywords: ["protein", "whey", "chicken", "meat", "tofu", "powder", "macros", "lean", "casein", "egg", "fish", "beef", "lentils", "amino", "turkey"],
    responses: [
      "Protein is your muscle's best friend. Since your goal is {goal}, I recommend hitting {pTarget}g daily.",
      "Are you getting your {pTarget}g of protein? It's essential for your {status} recovery protocol.",
      "Focus on high-quality sources like Greek yogurt, eggs, or lentils to reach that {pTarget}g target!",
      "Think of protein as bricks for your muscle house. No bricks, no house. Aim for {pTarget}g every single day.",
      "Spreading your protein across 4-5 meals triggers muscle protein synthesis more effectively than one big hit.",
      "Animal or plant-based? Both work for your {goal} plan! Plants just need a little more planning to hit {pTarget}g.",
      "Whey post-workout, casein before bed — that's the classic 1-2 punch for your {status} recovery.",
      "Your body can only absorb so much protein per meal. Keep each serving around 30-40g for max efficiency.",
      "High protein doesn't have to be boring. Protein pancakes, smoothies, and stir-fries can all hit that {pTarget}g target."
    ]
  },
  DIET_GENERAL: {
    keywords: ["diet", "food", "eat", "meal", "nutrition", "recipe", "cooking", "snacks", "eating", "calorie", "calories", "portion", "junk", "cheat", "hungry", "appetite"],
    responses: [
      "Your {goal} strategy depends 70% on what happens in the kitchen. Are you sticking to your {target_calories} calorie limit?",
      "For a {status} profile, focus on nutrient density. Think colors! At least 3 different colors on every plate.",
      "Let's refine your {goal} plan. Have you tried meal prepping for the next 3 days? It's a game changer.",
      "Hunger is information. Before you snack, ask yourself: am I actually hungry or just bored/stressed?",
      "A cheat meal isn't failure — it's a strategy tool. The key is keeping it to ONE meal, not a cheat day.",
      "Eating out? No problem. Prioritize grilled over fried, ask for sauces on the side, and load up on veggies first.",
      "The 80/20 rule applies here: eat clean 80% of the time, and the other 20% won't tank your {goal} progress.",
      "Your {target_calories} calorie goal is your compass, not a prison. Build meals you enjoy within it.",
      "Late night hunger? Keep low-calorie, high-volume options ready — cucumber slices, popcorn (unbuttered), or cottage cheese.",
      "Meal timing matters for your {goal}. Try to front-load your calories earlier in the day when your metabolism is most active.",
      "Never shop hungry! A full stomach makes smarter food decisions. Write that list before you leave home."
    ]
  },
  WORKOUT_GENERAL: {
    keywords: ["workout", "exercise", "train", "gym", "lift", "cardio", "strength", "hiit", "move", "reps", "sets", "routine", "program", "split", "session", "training"],
    responses: [
      "Movement is medicine! Your current {goal} phase benefits most from {logic} style training.",
      "Whether it's a heavy lift or a brisk walk, consistency wins. Did you mark your session as 'Complete' today?",
      "Don't skip the warm-up! For your {status} frame, joint mobility is just as important as the actual workout.",
      "Progressive overload is the name of the game. Are you adding at least a small amount of weight or reps each week?",
      "3 solid days in the gym beats 6 sloppy ones every time. Quality over quantity, always.",
      "Try a Push/Pull/Legs split for your {goal}. It hits each muscle group twice a week with built-in recovery.",
      "Compound movements first — squats, deadlifts, bench press — then isolation work. Build the foundation, then sculpt.",
      "Your rest periods are as important as your reps. For hypertrophy, keep rest to 60-90 seconds between sets.",
      "Feeling strong today? Go heavy. Feeling drained? Go for volume. Tune into your body's signal.",
      "Track your workouts. If it's not written down, it didn't happen — and you can't improve what you don't measure.",
      "Supersets can cut your gym time in half. Pair a push with a pull and watch your workout efficiency skyrocket.",
      "Form over ego, always. A clean 60kg squat builds more than a sloppy 100kg one."
    ]
  },
  WATER: {
    keywords: ["water", "drink", "hydrate", "thirst", "fluid", "hydration", "bottle", "dehydrated", "electrolyte"],
    responses: [
      "Hydration check! Your body needs {waterGoal} liters to keep your metabolism at peak efficiency.",
      "Are you carrying your water bottle? Aim for {waterGoal}L. Even 2% dehydration can drop your performance by 10%!",
      "Pro tip: Drink 500ml of water right when you wake up. It jumpstarts your engine for the day!",
      "Your urine color is your hydration report card. Pale yellow = good. Dark yellow = drink NOW.",
      "Add a pinch of Himalayan salt and a squeeze of lemon to your morning water for a natural electrolyte boost.",
      "Coffee and tea count toward hydration, but 70% of your {waterGoal}L should still come from plain water.",
      "Set a phone reminder every 90 minutes to drink a glass. You'll hit {waterGoal}L without even thinking about it.",
      "Feeling tired mid-afternoon? Before reaching for caffeine, try a full glass of water. Dehydration mimics fatigue.",
      "Pre-workout hydration matters: drink at least 500ml in the hour before training for peak performance."
    ]
  },
  MOTIVATION_LOW: {
    keywords: ["lazy", "tired", "quit", "hard", "motivation", "bored", "exhausted", "sleepy", "fail", "give up", "not feeling", "can't do this", "too much", "demotivated", "struggling"],
    responses: [
      "I hear you. But remember: 'Motivation is what gets you started, habit is what keeps you going.' Just give me 5 minutes!",
      "Fatigue is just feedback. If you're truly exhausted, prioritize the Sleep Protocol. If it's just 'the feels', push through!",
      "You've already started your 30-day journey. Don't let Day {day} be the one that stops you. Let's go! 🚀",
      "Nobody ever regretted a workout after it was done. Start with just 10 minutes and see how you feel.",
      "Your future self is watching you right now. What are you showing them?",
      "The gap between who you are and who you want to be is called action. Let's close it together.",
      "It's OK to have a bad day. It's NOT OK to have a bad month. What's one small thing you CAN do today?",
      "Rest is not the same as quitting. If you're genuinely burned out, a recovery day is a PRODUCTIVE choice.",
      "When it feels hardest, remember WHY you started. Write it down. Read it back. Then move.",
      "Progress isn't always visible. Trust the process. Your body is changing even when the mirror isn't showing it yet.",
      "Champions don't always feel like training. They train anyway. That's what separates them."
    ]
  },
  FASTING: {
    keywords: ["fasting", "intermittent", "if", "window", "omad", "autophagy", "fast", "16:8", "18:6", "one meal"],
    responses: [
      "Intermittent fasting can be great for {goal}. If you're doing 16:8, make sure your first meal is high-protein!",
      "Fasting isn't a magic bullet, but it helps with calorie control. Stay hydrated with black coffee or tea during the fast.",
      "Listen to your body. If you feel lightheaded during your fast, you might need more electrolytes (sodium/potassium).",
      "Ease into fasting if you're new. Start with 12 hours and gradually extend your window by 30 minutes per week.",
      "OMAD (One Meal A Day) is aggressive — only try it if you've been doing 16:8 comfortably for at least a month.",
      "Break your fast with protein and healthy fats first. It'll prevent an insulin spike and keep you full longer.",
      "Fasting doesn't mean starving. Your eating window should still hit your {target_calories} calorie target.",
      "Autophagy kicks in around the 16-18 hour mark. This cellular cleanup is one of fasting's most powerful benefits.",
      "Coffee drinker? Black coffee during your fast is fine — even beneficial. Just skip the milk and sugar."
    ]
  },
  SORENESS: {
    keywords: ["sore", "pain", "ache", "stiff", "hurt", "injury", "recovery", "doms", "muscle pain", "tight", "inflammation"],
    responses: [
      "DOMS (Delayed Onset Muscle Soreness) is a sign of new stimulus! Active recovery like light walking helps blood flow.",
      "If it's a sharp pain, STOP. If it's just muscle soreness, light stretching and hydration are your best tools.",
      "Contrast showers (hot/cold) can help reduce inflammation if you're feeling particularly stiff.",
      "Foam rolling for 10 minutes before bed can significantly reduce next-day soreness. Try it tonight!",
      "Soreness means your muscles are repairing and growing. It's a feature, not a bug — but manage it smartly.",
      "Epsom salt baths work! The magnesium absorbs through your skin and relaxes muscle tension beautifully.",
      "If soreness lasts more than 72 hours, you may have overtrained that muscle group. Give it another rest day.",
      "Light movement on rest days (yoga, walking, swimming) accelerates recovery far better than complete inactivity.",
      "Sleep is your number one recovery tool. 8 hours in a dark, cool room outperforms any supplement on the market."
    ]
  },
  PLATEAU: {
    keywords: ["plateau", "stuck", "weight not moving", "no change", "slow", "stopped", "stagnant", "not losing", "not gaining"],
    responses: [
      "Plateaus are normal. Your body is adapting! Try changing one variable: your rep range or your cardio intensity.",
      "Consistency is the cure for plateaus. Keep hitting your {target_calories} target and the scale will follow.",
      "Are you tracking your measurements or how your clothes fit? The scale doesn't always tell the whole story!",
      "Try a refeed day — eat at maintenance calories for one day. It resets hormones and often breaks a plateau.",
      "Deload week! Drop your weights by 40% for a week. You'll come back stronger and the plateau often disappears.",
      "Stress and poor sleep are hidden plateau culprits. Have you audited your lifestyle outside the gym lately?",
      "If you've been in a deficit for 12+ weeks, your metabolism has adapted. A 1-2 week diet break can reignite progress.",
      "Switch your training style entirely for 3-4 weeks. If you've been doing splits, try full-body. Your body hates boredom.",
      "Audit your calories honestly. It's very common to unconsciously underestimate portions once progress slows."
    ]
  },
  SUPPLEMENTS: {
    keywords: ["supplement", "creatine", "vitamin", "magnesium", "zinc", "preworkout", "bcaa", "fish oil", "omega", "collagen", "protein powder", "caffeine", "melatonin"],
    responses: [
      "Supplements are only the 5% on top of a good diet. Creatine is the most researched and safe for building {goal}.",
      "For recovery, Magnesium Glycinate before bed can improve sleep quality significantly.",
      "Focus on whole foods first! But a good multivitamin and Vitamin D are solid choices for most people.",
      "Creatine monohydrate — 5g daily, no loading phase needed. Take it consistently and results show in 3-4 weeks.",
      "BCAAs are largely unnecessary if you're already hitting {pTarget}g of protein. Save your money.",
      "Fish oil (2-3g EPA/DHA daily) reduces inflammation and supports heart health. Worth the investment.",
      "Vitamin D3 + K2 together is a power combo. Most people are deficient, especially if you train indoors.",
      "Pre-workout hype is real, but caffeine dependency is too. Cycle it — 5 days on, 2 days off — to keep sensitivity.",
      "Zinc + Magnesium (ZMA) before bed supports testosterone production and deep sleep. Underrated stack.",
      "Collagen peptides in your morning coffee support joints and tendons — great addition for high-volume training phases."
    ]
  },
  SLEEP: {
    keywords: ["sleep", "rest", "insomnia", "wake up", "tired", "nap", "bedtime", "drowsy", "night", "oversleep", "alarm"],
    responses: [
      "Sleep is where the REAL gains happen. Aim for 7-9 hours — no supplement can replace it.",
      "Poor sleep spikes cortisol, crashes testosterone, and tanks your {goal} progress. Guard your sleep fiercely.",
      "A consistent wake-up time (even weekends!) regulates your circadian rhythm and improves sleep quality dramatically.",
      "The 90-minute rule: try to sleep in 90-minute cycles (6h, 7.5h, 9h) to wake up feeling fresh, not groggy.",
      "No screens 45 minutes before bed. Blue light suppresses melatonin and delays your sleep onset by up to 2 hours.",
      "Keep your room below 19°C (66°F). A cooler room is proven to increase deep sleep percentage.",
      "If you nap, keep it to 20 minutes max before 3pm. Longer naps or later ones can disrupt your night sleep cycle.",
      "Magnesium Glycinate and L-Theanine are the cleanest natural sleep aids — no grogginess, just deep rest.",
      "If you can't sleep, try the 4-7-8 breathing method: inhale 4 counts, hold 7, exhale 8. It activates your parasympathetic system."
    ]
  },
  WEIGHT_LOSS: {
    keywords: ["lose weight", "weight loss", "fat loss", "slim", "trim", "burn fat", "cut", "cutting", "shred", "drop weight", "belly fat", "body fat"],
    responses: [
      "Fat loss is simple but not easy: burn more than you consume. Your {target_calories} target is your starting point.",
      "A 500-calorie daily deficit creates roughly 0.5kg of fat loss per week. Sustainable and muscle-sparing.",
      "Don't crash diet! Losing more than 1kg per week is likely muscle loss, not fat. Slow and steady protects your gains.",
      "Belly fat is the last to go for most people. Trust the process — you can't spot-reduce, but you CAN reduce overall.",
      "The more muscle you carry, the faster you burn fat at rest. Don't skip the weights just because your goal is {goal}!",
      "Cardio accelerates the deficit, but diet IS the deficit. You can't outrun a bad fork.",
      "Track your food for just 2 weeks. Most people are shocked by what they discover. Knowledge is the first tool.",
      "Protein is your secret weapon for fat loss — it keeps you full, preserves muscle, and has a high thermic effect.",
      "Weigh yourself at the same time every morning (after bathroom, before eating) for accurate trend data over weeks."
    ]
  },
  MUSCLE_GAIN: {
    keywords: ["gain muscle", "bulk", "bulking", "mass", "build muscle", "hypertrophy", "bigger", "grow", "size", "gains"],
    responses: [
      "Muscle growth needs three things: progressive overload, sufficient protein ({pTarget}g), and a calorie surplus.",
      "A clean bulk means 200-300 calories above maintenance. Too big a surplus and you'll gain fat faster than muscle.",
      "The sweet spot for hypertrophy is 6-12 reps per set with a challenging weight. Keep rest to 60-90 seconds.",
      "Muscles don't grow IN the gym — they grow during recovery. Training breaks them down; food and sleep build them back bigger.",
      "You can't rush muscle growth. Natural hypertrophy takes months and years, not days. Be patient with the {goal} process.",
      "Train each muscle group at least TWICE per week for maximum growth stimulus. One workout per week isn't enough.",
      "Mind-muscle connection is real. Slow down your reps and genuinely FEEL the target muscle working on each rep.",
      "Newbie gains are the best gains! If you're just starting, you can build muscle AND lose fat simultaneously for a few months.",
      "Track your PRs (personal records) religiously. If you're getting stronger, you're building muscle — guaranteed."
    ]
  },
  STRESS: {
    keywords: ["stress", "anxiety", "mental", "overwhelmed", "pressure", "burnout", "tense", "nervous", "worried", "panic", "breathe"],
    responses: [
      "Chronic stress elevates cortisol, which literally eats your muscle and stores fat. Managing stress IS part of your {goal} plan.",
      "Deep breathing isn't soft — it's science. 5 minutes of box breathing (4-4-4-4) measurably lowers cortisol levels.",
      "Exercise is one of the most powerful anti-anxiety tools ever discovered. Even a 20-minute walk shifts your brain chemistry.",
      "Journal for 5 minutes before bed. Offloading mental clutter onto paper improves sleep quality and reduces cortisol.",
      "Burnout is real. Recognize when you need to recover emotionally, not just physically. Both count toward your {goal}.",
      "Try a digital sunset — phone down 1 hour before bed. Your nervous system will thank you enormously.",
      "Cold showers in the morning activate your vagus nerve and dramatically improve stress resilience throughout the day.",
      "You can't out-train a toxic environment. If your stress is chronic and external, that's a life conversation, not just a fitness one.",
      "Adaptogenic herbs like Ashwagandha (300-600mg) have clinical evidence for reducing cortisol in chronically stressed individuals."
    ]
  },
  CARDIO: {
    keywords: ["cardio", "run", "running", "jog", "cycle", "cycling", "swimming", "walk", "treadmill", "steps", "aerobic", "endurance", "stamina", "marathon", "sprint"],
    responses: [
      "Cardio is a tool, not a punishment. Zone 2 (conversational pace) cardio 3x per week is gold for {goal}.",
      "HIIT burns more calories in less time. But steady-state cardio is easier to recover from and less taxing on the nervous system.",
      "10,000 steps is a great daily target. It adds up to a meaningful calorie burn without any formal workout.",
      "If your goal is {goal}, program cardio AFTER weights, not before. Protect your lifting performance first.",
      "Running without building a base first leads to injury. Start with walk/jog intervals and build up over 8-12 weeks.",
      "VO2 max is the king of longevity markers. Improving your cardio fitness may be the single best thing for long-term health.",
      "Fasted morning cardio has mixed research. If it works for your schedule and you feel good doing it — keep it.",
      "Cycling and swimming are joint-friendly cardio alternatives that are excellent for {status} recovery protocols.",
      "Tracking your heart rate zones during cardio makes the workout smarter. Zone 2 for base, Zone 4-5 for performance peaks."
    ]
  },
  FLEXIBILITY_MOBILITY: {
    keywords: ["stretch", "stretching", "yoga", "flexibility", "mobility", "tight hips", "posture", "foam roll", "range of motion", "hamstring", "back pain"],
    responses: [
      "Mobility is the foundation everything is built on. Poor mobility is the silent killer of performance AND longevity.",
      "Hold each stretch for 30-60 seconds minimum. Anything less is barely a warm-up, not a flexibility session.",
      "Morning yoga (even 10 minutes) sets your nervous system up for a calm, focused day. Try it for 7 days.",
      "Hip flexor tightness is epidemic in desk workers. Daily hip stretches will transform your squat and relieve back pain.",
      "Dynamic stretching BEFORE workouts. Static stretching AFTER. Don't mix them up — it impacts performance.",
      "Yoga once a week combined with your training program can add 15-20% more range of motion within 6-8 weeks.",
      "Poor posture is a movement pattern, not a spine issue. Strengthen your posterior chain and open your chest — it fixes itself.",
      "Foam rolling isn't painful because it's bad — it's painful because you need it. Spend more time on the spots that hurt most.",
      "The 90/90 hip stretch is the single best movement for anyone who sits more than 6 hours a day. Do it nightly."
    ]
  },
  GOAL_SETTING: {
    keywords: ["goal", "target", "plan", "objective", "achieve", "result", "track", "progress", "measure", "milestone", "commitment"],
    responses: [
      "A goal without a plan is just a wish. Let's build your {goal} roadmap together — what's your first checkpoint?",
      "Use the SMART framework: Specific, Measurable, Achievable, Relevant, Time-bound. Vague goals get vague results.",
      "Break your big goal into 4-week sprints. At the end of each sprint, audit and adjust. Flexibility is strength.",
      "What does success look like in 12 weeks for you? Visualize it specifically — weight, energy, how clothes fit, strength numbers.",
      "Write your goal down and put it somewhere you see DAILY. Visual cues activate commitment subconsciously.",
      "Share your {goal} with someone you respect. Accountability multiplies your chance of follow-through by 65%.",
      "Focus on behavior goals, not outcome goals. 'I will train 4x per week' is more controllable than 'I will lose 10kg'.",
      "Celebrate small wins! Every week you hit your targets is a victory worth acknowledging — don't wait for the finish line.",
      "Review your progress weekly, not daily. Daily fluctuations are noise; weekly trends are signal."
    ]
  },
  NUTRITION_TIMING: {
    keywords: ["pre workout", "post workout", "before gym", "after gym", "when to eat", "meal timing", "breakfast", "lunch", "dinner", "evening meal"],
    responses: [
      "Pre-workout meal: carbs + protein 60-90 minutes before training. Think oats and eggs, or rice with chicken.",
      "Post-workout window: eat within 30-60 minutes after training. Prioritize fast-digesting protein like whey or chicken.",
      "Breakfast isn't mandatory — but if you skip it, your first meal MUST still hit your protein targets for the day.",
      "Don't train on a completely empty stomach unless you're doing a fasted cardio session. Performance suffers significantly.",
      "Carbs aren't the enemy — they're your FUEL. Time your biggest carb serving around your workout for peak performance.",
      "Dinner should be your lightest meal if your {goal} is fat loss. Your metabolism naturally slows in the evening.",
      "Late-night protein (cottage cheese, casein shake) can actually support {goal} muscle repair while you sleep.",
      "The overall daily total matters more than perfect meal timing. Don't stress the windows — stress the totals.",
      "If you train early morning, even half a banana and a small protein shake before is better than nothing."
    ]
  },
  BODY_IMAGE: {
    keywords: ["ugly", "fat", "skinny", "disgusting", "body image", "hate my body", "ashamed", "embarrassed", "confidence", "self-esteem", "insecure"],
    responses: [
      "Your body brought you here today. That takes courage. Let's build from a place of respect, not punishment.",
      "Fitness works best when it's driven by self-love, not self-loathing. You deserve health because you're worth it.",
      "Progress photos can be powerful — but compare yourself to last month's you, never to someone else's highlight reel.",
      "The fitness journey is as much internal as external. Working on mindset alongside training multiplies your results.",
      "You are more than a number on a scale. How you FEEL — energy, sleep, strength — matters more than aesthetics.",
      "If you find yourself being really harsh about your body, consider speaking to someone who specializes in this. Coach cares about your whole wellbeing.",
      "Build the identity of someone who TAKES CARE of themselves. Every healthy choice is a vote for that identity.",
      "Confidence isn't a reward you get after transformation — it's something you practice every day, starting now.",
      "Health is a lifelong relationship with your body. Start building that relationship with kindness, not criticism."
    ]
  },
  CHEAT_MEAL: {
    keywords: ["cheat meal", "cheat day", "pizza", "burger", "junk food", "treat", "indulge", "ice cream", "dessert", "candy", "unhealthy food"],
    responses: [
      "One cheat meal won't ruin your progress, just like one salad won't transform you. Context is everything.",
      "A planned cheat meal actually resets leptin levels — the hormone that regulates hunger and metabolism. Use it strategically.",
      "The key word is MEAL, not day. Keep it to one sitting, enjoy it fully, then get straight back on track.",
      "If a cheat meal turns into a cheat weekend, that's where progress stalls. Enjoy it, but own the next meal too.",
      "Try to get some protein even in your cheat meal. A burger with the bun isn't the end of the world — it's life.",
      "No food is morally 'bad'. Guilt-free enjoyment of food is part of a healthy relationship with eating.",
      "Plan your cheat meal at the END of your hardest training week. You'll have earned the glycogen refuel!",
      "After a big calorie day, just get back to your {target_calories} tomorrow. No restriction, no punishment. Just back to the plan.",
      "If you're tracking macros, you can literally fit a small dessert in DAILY and still hit your {goal} targets. IIFYM!"
    ]
  },
  AGING_FITNESS: {
    keywords: ["age", "older", "40s", "50s", "60s", "senior", "aging", "menopause", "testosterone", "hormones", "middle age", "mature"],
    responses: [
      "Fitness after 40 is not about working HARDER — it's about working SMARTER. Recovery becomes the priority.",
      "Muscle mass naturally declines after 35 (sarcopenia). Resistance training is the most powerful countermeasure.",
      "Hormone changes are real, but they're NOT an excuse to give up. Many people hit their best shape in their 40s and 50s.",
      "Protein needs actually INCREASE with age. Older athletes need MORE, not less. Target {pTarget}g without compromise.",
      "Sleep and recovery take priority even more as you age. Overtraining at 50 has much harsher consequences than at 25.",
      "Joint-friendly training options like cycling, swimming, and resistance machines protect longevity while maintaining gains.",
      "VO2 max and grip strength are two of the best longevity biomarkers. Train both, and you'll age like fine wine.",
      "Consistency over decades beats intensity over months. The most important workout is the one you can still do at 70.",
      "Creatine is especially valuable for older athletes — it combats age-related muscle and cognitive decline simultaneously."
    ]
  },
  TRACKING_LOGGING: {
    keywords: ["track", "log", "app", "myfitnesspal", "calorie tracking", "macro tracking", "journal", "logbook", "record", "diary", "data"],
    responses: [
      "What gets measured gets managed. Tracking calories even for 2-3 weeks creates lifelong portion awareness.",
      "You don't have to track forever. But track until you can eyeball your portions accurately — usually 8-12 weeks.",
      "Weigh your food. Seriously. A tablespoon of peanut butter is 190 calories by the scale, 400+ if you eyeball it.",
      "Logging your workouts (weights, reps, rest times) gives you a roadmap for progressive overload. Guessing doesn't work.",
      "Review your food log weekly, not daily. Look for patterns: where are your calories hiding? What triggers overeating?",
      "Photos are data too! Take a weekly progress photo in consistent lighting. Over 12 weeks, the transformation will shock you.",
      "If tracking feels obsessive or stressful, take a week off from numbers and focus on intuitive eating habits.",
      "Your coach needs data to help you. Even rough logging (not perfect) gives us 80% of the insight at 20% of the effort.",
      "Use a logbook for your sessions: date, exercises, weights, sets, reps. Look back monthly. You WILL be motivated by progress."
    ]
  },
  BEGINNER: {
    keywords: ["beginner", "start", "starting", "new to", "never done", "first time", "don't know where", "lost", "confused", "newbie", "noob", "just started"],
    responses: [
      "Everyone starts somewhere. The best program is the one you'll actually show up for consistently. Let's find yours.",
      "For beginners: 3 full-body sessions per week with compound movements. Keep it simple — squat, hinge, push, pull, carry.",
      "Master the basics for 3-4 months before worrying about advanced techniques. Foundation = everything.",
      "Start with bodyweight or light weights. Ego-lifting as a beginner is the fastest path to injury and discouragement.",
      "Pick one goal to start: {goal}. Trying to do everything at once leads to doing nothing well.",
      "Your first 3 months are all about building habits. Results will come — but the habit has to come first.",
      "Don't compare your Chapter 1 to someone else's Chapter 20. You're both writing your own books.",
      "A trainer or a coach (👋) for your first 4-6 weeks builds the right patterns that compound for years afterward.",
      "Soreness in the first few weeks is normal. It will reduce as your body adapts. Don't use it as a reason to stop."
    ]
  },
  FOOD_CRAVINGS: {
    keywords: ["craving", "crave", "addicted", "sugar", "sweet", "chocolate", "chips", "snacking", "binge", "can't stop eating", "overeat"],
    responses: [
      "Cravings are often a signal, not a weakness. Sweet cravings can mean low blood sugar — are you eating enough?",
      "Out of sight, out of mind. Don't stock trigger foods at home. Willpower is a limited resource — environment is infinite.",
      "Eat enough PROTEIN and FIBER at meals and your sweet cravings will naturally reduce over 7-10 days. Science-backed.",
      "Craving chocolate? Have some! Dark chocolate (85%+) is nutrient-dense and surprisingly satisfying in small amounts.",
      "Binge eating often follows restriction. If you're eating too little at {target_calories}, your body WILL fight back later.",
      "Distract with movement. A 10-minute walk is one of the most effective craving-breaking strategies ever documented.",
      "Try brushing your teeth after dinner. The mint signal tells your brain 'eating is done.' Strangely effective!",
      "Craving salty things? You might actually need more electrolytes, not more chips. Try a pinch of salt in water.",
      "If cravings feel compulsive and out of control regularly, that's worth discussing with a professional — it's not just willpower."
    ]
  },

  // ─── FALLBACK ───────────────────────────────────────────────────────────────
  DEFAULT: {
    keywords: [],
    responses: [
      "I'm processing that! Can you tell me more about your {goal} goals or maybe your diet?",
      "Hmm, tell me more! Are you asking about nutrition, training, recovery, or mindset?",
      "I want to help you nail your {goal} journey. Could you rephrase that or give me a bit more context?",
      "Great question territory! Narrow it down for me — is this about food, training, sleep, or something else?",
      "Coach is thinking... Let's make sure I give you the right advice. Is this a diet question or a training one?",
      "Not 100% sure what you mean, but I'm HERE for it. Tell me more and we'll figure it out together!"
    ]
  }
};

const classifyIntent = (message) => {
  const msg = message.toLowerCase();
  let bestIntent = "DEFAULT";
  let maxScore = 0;

  for (const [intent, data] of Object.entries(intents)) {
    if (intent === "DEFAULT") continue;
    let score = 0;
    data.keywords.forEach(keyword => {
      if (msg.includes(keyword)) score += 1;

      // Simple Fuzzy Match (one character off) - can be improved
      if (msg.length > 5 && keyword.length > 3) {
        // This is a very basic simulation of fuzzy logic
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  }

  return bestIntent;
};

const getResponse = (intent, context) => {
  const data = intents[intent] || intents["DEFAULT"];

  const pool = data.responses;
  let response = pool[Math.floor(Math.random() * pool.length)];

  // Inject Context Variables
  const { goal, weight, status, target_calories, day } = context || {};
  const pTarget = weight ? Math.round(weight * 1.8) : 150;
  const waterGoal = weight ? (weight * 0.033).toFixed(1) : 2.5;
  const logic = goal === 'lose_weight' ? 'HIIT/Cardio' : 'Strength/Hypertrophy';

  response = response
    .replace(/{goal}/g, (goal || 'fitness').replace('_', ' '))
    .replace(/{weight}/g, weight || 'target')
    .replace(/{status}/g, status || 'Healthy')
    .replace(/{pTarget}/g, pTarget)
    .replace(/{target_calories}/g, target_calories || 2000)
    .replace(/{waterGoal}/g, waterGoal)
    .replace(/{logic}/g, logic)
    .replace(/{day}/g, day || 'X');

  return response;
};

module.exports = { classifyIntent, getResponse, intents };