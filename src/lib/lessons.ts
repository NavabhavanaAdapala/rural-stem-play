// Short learning sessions shown before quizzes, keyed by subject name.
export type Lesson = { title: string; minutes: number; points: string[] };

const L: Record<string, Lesson[]> = {
  Mathematics: [
    { title: "Numbers & Operations", minutes: 10, points: ["Whole numbers, fractions and decimals", "Order of operations (BODMAS)", "Factors, multiples, HCF and LCM"] },
    { title: "Algebra Basics", minutes: 12, points: ["Variables stand for unknown numbers", "Solve simple equations like 2x + 3 = 11", "Use formulas from daily life"] },
    { title: "Geometry & Shapes", minutes: 12, points: ["Angles, triangles and circles", "Perimeter and area of shapes", "Sum of angles in a triangle = 180°"] },
  ],
  Science: [
    { title: "Living Things", minutes: 10, points: ["Cells are the building blocks of life", "Plants make food by photosynthesis", "Humans have organ systems"] },
    { title: "Matter & Materials", minutes: 10, points: ["Solids, liquids and gases", "Physical vs chemical changes", "Mixtures and how to separate them"] },
    { title: "Force & Energy", minutes: 12, points: ["Push and pull are forces", "Energy changes form but is not lost", "Simple machines make work easier"] },
  ],
  "Computer Science": [
    { title: "What is a Computer?", minutes: 8, points: ["Input, processing, output", "Hardware vs software", "Memory and storage"] },
    { title: "Thinking Like a Coder", minutes: 12, points: ["Algorithms are step-by-step instructions", "Loops repeat steps", "Conditions make decisions"] },
  ],
  Engineering: [
    { title: "How Things Work", minutes: 10, points: ["Levers, pulleys and wheels", "Structures need strong shapes like triangles", "Engineers solve real problems"] },
    { title: "Design Process", minutes: 10, points: ["Ask, imagine, plan, build, test", "Learn from mistakes", "Improve your design"] },
  ],
  "Environmental Science": [
    { title: "Our Environment", minutes: 10, points: ["Ecosystems and food chains", "Water cycle", "Why forests matter"] },
    { title: "Saving Resources", minutes: 8, points: ["Reduce, reuse, recycle", "Save water in farms and homes", "Renewable energy: sun and wind"] },
  ],
  History: [
    { title: "Ancient India", minutes: 10, points: ["Indus Valley Civilisation", "Mauryan and Gupta empires", "Great rulers like Ashoka"] },
    { title: "Freedom Struggle", minutes: 12, points: ["1857 revolt", "Gandhi and non-violence", "Independence in 1947"] },
  ],
  "Social Studies": [
    { title: "Our Country", minutes: 10, points: ["States and capitals", "Rivers and mountains of India", "Our Constitution"] },
    { title: "Community & Government", minutes: 10, points: ["Panchayati Raj in villages", "Rights and duties", "How elections work"] },
  ],
  English: [
    { title: "Grammar Basics", minutes: 10, points: ["Nouns, verbs and adjectives", "Tenses: past, present, future", "Making correct sentences"] },
    { title: "Reading & Vocabulary", minutes: 10, points: ["Read short stories", "Learn new words daily", "Synonyms and antonyms"] },
  ],
  Hindi: [
    { title: "व्याकरण", minutes: 10, points: ["संज्ञा, सर्वनाम, क्रिया", "लिंग और वचन", "सही वाक्य बनाना"] },
    { title: "पठन", minutes: 10, points: ["कहानियाँ और कविताएँ", "नए शब्द सीखें", "पर्यायवाची और विलोम"] },
  ],
  Arts: [
    { title: "Colours & Drawing", minutes: 8, points: ["Primary and secondary colours", "Lines, shapes and shading", "Folk art like Warli and Madhubani"] },
  ],
  "Physical Education": [
    { title: "Healthy Body", minutes: 8, points: ["Daily exercise and yoga", "Balanced diet", "Sleep and hygiene"] },
    { title: "Sports & Teamwork", minutes: 8, points: ["Rules of kabaddi and kho-kho", "Fair play", "Warm-up before games"] },
  ],
};

export const lessonsFor = (subjectName: string): Lesson[] =>
  L[subjectName] || [{ title: `Introduction to ${subjectName}`, minutes: 8, points: ["Key ideas of the subject", "Why it matters in daily life", "Get ready for the quiz"] }];
