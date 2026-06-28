
// js/question/lagosSlangs.js

/**
 * Lagos Slangs Trivia Question Bank
 * Returns a random question from the dataset
 * Each question contains: question, optionA, optionB, optionC, optionD, correctAnswer, category, difficulty
 */
function lagosSlangs() {
    const questions = [
        {
            question: "What does E go be mean?",
            optionA: "Customized luxury jewelry",
            optionB: "Hopeful sign-off phrase",
            optionC: "Useless",
            optionD: "A boss",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Wetin dey? mean?",
            optionA: "Absolute solidarity expression",
            optionB: "Outright cheating bias",
            optionC: "To be aggressive",
            optionD: "What is happening?",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Afa mean?",
            optionA: "How's the vibe?",
            optionB: "Pay maximum attention",
            optionC: "A massive debt",
            optionD: "Secret outside lover",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Abeg mean?",
            optionA: "Sexual penetration act",
            optionB: "Please",
            optionC: "An elevated bridge",
            optionD: "Standing firmly unshaken",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Comot mean?",
            optionA: "To leave",
            optionB: "Absolute confidence phrase",
            optionC: "Stay vigilant always",
            optionD: "Fake wealth impression",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Oya mean?",
            optionA: "Let's go",
            optionB: "Sturdy everyday items",
            optionC: "Aware of gossip",
            optionD: "Leaked exam answers",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Shey? mean?",
            optionA: "No nonsense time",
            optionB: "Secondary income stream",
            optionC: "Right?",
            optionD: "Emergency savings buffer",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Abi? mean?",
            optionA: "Goodbye see you",
            optionB: "Isn't it?",
            optionC: "Sudden fear feeling",
            optionD: "Excelling in exams",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Na so mean?",
            optionA: "That is true",
            optionB: "Money",
            optionC: "Tough unyielding person",
            optionD: "Flaunting wealth publicly",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gbam! mean?",
            optionA: "Collecting cash drops",
            optionB: "Maintain a frown",
            optionC: "Exactly!",
            optionD: "Coolness measuring metric",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Nawa oh! mean?",
            optionA: "Bragging about luxury",
            optionB: "Only works when watched",
            optionC: "Street tout",
            optionD: "Expression of disbelief",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Ah-ahn! mean?",
            optionA: "Secret dating arrangement",
            optionB: "Only works when watched",
            optionC: "Under drug influence",
            optionD: "Expression of shock",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Chilax mean?",
            optionA: "Chill and relax",
            optionB: "Major deal success",
            optionC: "Cool energy projected",
            optionD: "To talk",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Padi mean?",
            optionA: "To highly motivate",
            optionB: "A close friend",
            optionC: "Based on lies",
            optionD: "Intense disgust",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Bros mean?",
            optionA: "Extreme hardship level",
            optionB: "Have significant money",
            optionC: "Goodbye till later",
            optionD: "A male companion",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Guy mean?",
            optionA: "A generic peer",
            optionB: "An internet scammer",
            optionC: "Extra large blessing",
            optionD: "Matter completely done",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Show mean?",
            optionA: "Ignoring text replies",
            optionB: "Dry Garri",
            optionC: "To arrive",
            optionD: "Absolute flat refusal",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Waka mean?",
            optionA: "We move forward",
            optionB: "To walk around",
            optionC: "Deep resilience statement",
            optionD: "Stable responsible man",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Yarn mean?",
            optionA: "Absolute truth",
            optionB: "To talk",
            optionC: "Ignoring text replies",
            optionD: "In massive trouble",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does No wahala mean?",
            optionA: "Deeply envious feeling",
            optionB: "Trouble comes easily",
            optionC: "No problem",
            optionD: "Hyper street guy",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Sapa mean?",
            optionA: "Spend recklessly always",
            optionB: "A gullible person",
            optionC: "Spending carelessly always",
            optionD: "Extreme financial brokenness",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Hammer mean?",
            optionA: "Popular social figure",
            optionB: "A gossip",
            optionC: "To strike rich",
            optionD: "Connected street contact",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Hold bar mean?",
            optionA: "Pledging trend loyalty",
            optionB: "A young woman",
            optionC: "Have significant money",
            optionD: "Spiced beef jerky",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Awoof mean?",
            optionA: "Intense disgust",
            optionB: "Sexual penetration act",
            optionC: "Very common thing",
            optionD: "Free stuff",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Jara mean?",
            optionA: "An extra portion",
            optionB: "A dead matter",
            optionC: "Strict religious woman",
            optionD: "A young woman",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Egunje mean?",
            optionA: "Pretending not to hear",
            optionB: "Youth Corps members",
            optionC: "Exposing someone's trouble",
            optionD: "A bribe",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Dash mean?",
            optionA: "Local canteen vendor",
            optionB: "To give gifts",
            optionC: "A messy complication",
            optionD: "Trusted account owner",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Maga mean?",
            optionA: "Very strange situation",
            optionB: "A gullible person",
            optionC: "Get out now",
            optionD: "Traffic enforcement officials",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Bar mean?",
            optionA: "Do not break",
            optionB: "Money",
            optionC: "Trickery",
            optionD: "Chill and relax",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Akpalakpala mean?",
            optionA: "Elite wealth confidence",
            optionB: "Physical cash",
            optionC: "To have casual sex",
            optionD: "To be street-smart",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Oga mean?",
            optionA: "Does that make sense",
            optionB: "A boss",
            optionC: "Deep emotional sorrow",
            optionD: "Keep investments secure",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Idan mean?",
            optionA: "Feeling physically sick",
            optionB: "A resourceful person",
            optionC: "Wasting valuable time",
            optionD: "Endorse romantic pairing",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Ajebutter mean?",
            optionA: "Lethal traditional beating",
            optionB: "A wealthy person",
            optionC: "Trend-aware person",
            optionD: "Absolute agreement exclamation",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Ajepako mean?",
            optionA: "A rugged person",
            optionB: "Dressing for clout",
            optionC: "A generic peer",
            optionD: "Elite wealth confidence",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Trenches mean?",
            optionA: "Stay vigilant always",
            optionB: "Sneak away quietly",
            optionC: "The ghetto",
            optionD: "A very jealous person",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Baffles mean?",
            optionA: "Expensive clothes",
            optionB: "Open-air relaxation spot",
            optionC: "Vintage wooden truck",
            optionD: "Shut up now",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Tear rubber mean?",
            optionA: "Funds from victims",
            optionB: "Hearing juicy gossip",
            optionC: "Expensive neighbourhood living",
            optionD: "Brand new",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Pure water mean?",
            optionA: "Very common thing",
            optionB: "An extra portion",
            optionC: "Transport via buses",
            optionD: "Paying street actors",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Aza mean?",
            optionA: "Everyone has secrets",
            optionB: "Bank account number",
            optionC: "An unexpected calamity",
            optionD: "Platonic opposite-sex friendship",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does 419 mean?",
            optionA: "Most luxurious lifestyle",
            optionB: "A fraudster",
            optionC: "Street luggage",
            optionD: "Standing firmly unshaken",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Wahala mean?",
            optionA: "Trade of insults",
            optionB: "Failing and retaking",
            optionC: "Trouble",
            optionD: "Very common thing",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Vex mean?",
            optionA: "Sneak away quietly",
            optionB: "To get angry",
            optionC: "An extremely thin person",
            optionD: "Street tout",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Yab mean?",
            optionA: "Rugged and unyielding",
            optionB: "To insult",
            optionC: "Eat until stuffed",
            optionD: "Clinging to someone",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Ment mean?",
            optionA: "Chill and relax",
            optionB: "To act crazy",
            optionC: "Always in library",
            optionD: "A sex worker",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Kolo mean?",
            optionA: "Everything under control",
            optionB: "An exaggerated lie",
            optionC: "Customized luxury jewelry",
            optionD: "Go completely insane",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Fall my hand mean?",
            optionA: "Total comfort, zero stress",
            optionB: "Disappoint someone",
            optionC: "Police officers",
            optionD: "A generic peer",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Control P mean?",
            optionA: "Having zero money",
            optionB: "Taking things personally",
            optionC: "Cooked cow skin",
            optionD: "Using illegal shortcut",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Lori iro mean?",
            optionA: "Shock or amazement",
            optionB: "Sturdy everyday items",
            optionC: "Based on lies",
            optionD: "Emergency savings buffer",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Wayo mean?",
            optionA: "Absolute agreement exclamation",
            optionB: "Trickery",
            optionC: "Excelling in exams",
            optionD: "Spiced goat head",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Dem send you? mean?",
            optionA: "Specific people category",
            optionB: "Were you sent?",
            optionC: "Secret dating arrangement",
            optionD: "Street luggage",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Tear head mean?",
            optionA: "To be aggressive",
            optionB: "Peaceful goodnight sign-off",
            optionC: "Doing it secretly",
            optionD: "Paying street actors",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does I no gree mean?",
            optionA: "I disagree",
            optionB: "Everyone has secrets",
            optionC: "Field dominating guy",
            optionD: "Egg and noodle mix",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Oversabi mean?",
            optionA: "Connected street contact",
            optionB: "Cheap local gin",
            optionC: "Deep emotional sorrow",
            optionD: "A know-it-all",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Gbagaun mean?",
            optionA: "Endorse romantic pairing",
            optionB: "Pay maximum attention",
            optionC: "A grammatical error",
            optionD: "The human buttocks",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Shakara mean?",
            optionA: "To show off",
            optionB: "Doing it secretly",
            optionC: "A cattle egret",
            optionD: "What is unfolding?",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Kpafuka mean?",
            optionA: "To be street-smart",
            optionB: "To break down",
            optionC: "Painful romantic breakup",
            optionD: "Noodles and spaghetti",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Bone mean?",
            optionA: "Bribing for grades",
            optionB: "Heavy beating baton",
            optionC: "To frown",
            optionD: "Elite standing person",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gongo Aso mean?",
            optionA: "Brand new currency",
            optionB: "Something great happens",
            optionC: "Hyper street guy",
            optionD: "To dodge bad vibes",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Yeye mean?",
            optionA: "Useless",
            optionB: "Transfer still processing",
            optionC: "Based on lies",
            optionD: "Complicated romantic mess",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Clapback mean?",
            optionA: "A gullible person",
            optionB: "Extreme wealth display",
            optionC: "A sharp retort",
            optionD: "Dressing for clout",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Chop mean?",
            optionA: "Local canteen vendor",
            optionB: "To eat",
            optionC: "To highly motivate",
            optionD: "Useless",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Go-slow mean?",
            optionA: "Go completely insane",
            optionB: "Bribing for grades",
            optionC: "A traffic jam",
            optionD: "Negative boring energy",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Danfo mean?",
            optionA: "Yellow commercial bus",
            optionB: "Smoky suya corner",
            optionC: "Deep emotional sorrow",
            optionD: "Matching cool energy",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Okada mean?",
            optionA: "Right?",
            optionB: "Commercial motorcycle",
            optionC: "Exposing someone's trouble",
            optionD: "Elite digital escort",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Drop mean?",
            optionA: "A private ride",
            optionB: "To physically overpower",
            optionC: "The deep ghetto",
            optionD: "Marijuana-mixed drink",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Agbero mean?",
            optionA: "Street tout",
            optionB: "Keep opinions private",
            optionC: "Right?",
            optionD: "Become hyper-aggressive",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Area Boys mean?",
            optionA: "Exclaiming over blessings",
            optionB: "It is plenty",
            optionC: "Neighborhood touts",
            optionD: "Your personal choice",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Agege Bread mean?",
            optionA: "Scanning your environment",
            optionB: "Soft local bread",
            optionC: "To give gifts",
            optionD: "Secondary income stream",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Spagewa mean?",
            optionA: "Strict dress code",
            optionB: "Exactly!",
            optionC: "Spaghetti and beans",
            optionD: "No nonsense time",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Indospag mean?",
            optionA: "A deceptive strategy",
            optionB: "Thrifting for clothes",
            optionC: "Hustle never collapse",
            optionD: "Noodles and spaghetti",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Sawdust mean?",
            optionA: "Dry Garri",
            optionB: "Exactly!",
            optionC: "Bribing for grades",
            optionD: "Transactional money relationship",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Kabu Kabu mean?",
            optionA: "How is your health?",
            optionB: "South Africa",
            optionC: "School childhood lover",
            optionD: "Unregistered taxi",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Amebo mean?",
            optionA: "Top authority figure",
            optionB: "A private ride",
            optionC: "A gossip",
            optionD: "Memorizing without understanding",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Soji mean?",
            optionA: "Term for vegetables",
            optionB: "Tiny mocking amount",
            optionC: "To be street-smart",
            optionD: "Make rivals uncomfortable",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Japa mean?",
            optionA: "Praising sharp intelligence",
            optionB: "Sneak away quietly",
            optionC: "Sudden fear feeling",
            optionD: "To permanently emigrate",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Jar mean?",
            optionA: "Complicated romantic mess",
            optionB: "To be street-smart",
            optionC: "Settling outstanding debt",
            optionD: "To run away",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Oyinbo mean?",
            optionA: "Isn't it?",
            optionB: "A white person",
            optionC: "To die",
            optionD: "Premium street marijuana",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Jand mean?",
            optionA: "It is gone",
            optionB: "Expression of shock",
            optionC: "The United Kingdom",
            optionD: "A rugged person",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Yankee mean?",
            optionA: "Dangling skin piece",
            optionB: "United States",
            optionC: "Hard alcohol drink",
            optionD: "Local hired contractor",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Southie mean?",
            optionA: "How's the vibe?",
            optionB: "South Africa",
            optionC: "To arrive",
            optionD: "Yoruba accent mimicry",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Owambe mean?",
            optionA: "A lavish party",
            optionB: "To leave",
            optionC: "Eat until stuffed",
            optionD: "Vintage wooden truck",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Aso Ebi mean?",
            optionA: "Traditional uniform outfits",
            optionB: "Need the restroom",
            optionC: "Fake wealth impression",
            optionD: "Trusted account owner",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Efizzy mean?",
            optionA: "Pay to impress",
            optionB: "Premium street marijuana",
            optionC: "A gossip",
            optionD: "Flashy behavior",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Knack mean?",
            optionA: "What is unfolding?",
            optionB: "To befriend someone",
            optionC: "To have sex",
            optionD: "Sneak out secretly",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Straff mean?",
            optionA: "Hiring vehicle privately",
            optionB: "Street tout",
            optionC: "Standard street protocol",
            optionD: "To have sex",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Aristo mean?",
            optionA: "Utter total failure",
            optionB: "Refined polished person",
            optionC: "Stay vigilant always",
            optionD: "A sugar daddy",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Ashawo mean?",
            optionA: "Being very hungry",
            optionB: "Do not break",
            optionC: "A sex worker",
            optionD: "What is happening?",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Ikebe mean?",
            optionA: "Female buttocks",
            optionB: "Local food vendor",
            optionC: "Major deal success",
            optionD: "Most luxurious lifestyle",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Lepa mean?",
            optionA: "Vintage wooden truck",
            optionB: "Illegal driver levies",
            optionC: "Effortless personal style",
            optionD: "A slim woman",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Orobo mean?",
            optionA: "A plump person",
            optionB: "To run away",
            optionC: "Goodbye see you",
            optionD: "Hustle never collapse",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Sisi mean?",
            optionA: "A young woman",
            optionB: "Stay vigilant always",
            optionC: "Extreme hardship level",
            optionD: "Fully capable person",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gorimakpa mean?",
            optionA: "Dedicated academic bookworm",
            optionB: "A bald head",
            optionC: "Scenario has occurred",
            optionD: "Steady cash inflow",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Konk mean?",
            optionA: "Sells imported cars",
            optionB: "Glamorous uniform clique",
            optionC: "A painful knock",
            optionD: "Share wealth secret",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Shaks mean?",
            optionA: "A grammatical error",
            optionB: "Alcoholic drinks",
            optionC: "Transactional money relationship",
            optionD: "To act crazy",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Kpai mean?",
            optionA: "A bald head",
            optionB: "To die",
            optionC: "Traffic enforcement officials",
            optionD: "Deep emotional sorrow",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Ekelebay mean?",
            optionA: "Police officers",
            optionB: "Field dominating guy",
            optionC: "Have significant money",
            optionD: "Vibe someone brings",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Kampe mean?",
            optionA: "To feel safe",
            optionB: "Eat until stuffed",
            optionC: "Wild erratic behavior",
            optionD: "Trouble",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does We meuve mean?",
            optionA: "Hitting perfectly right",
            optionB: "Most luxurious lifestyle",
            optionC: "Spiced goat head",
            optionD: "We move forward",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Mafo mean?",
            optionA: "Neighborhood touts",
            optionB: "Lighthearted life approach",
            optionC: "Stop heavy English",
            optionD: "Do not break",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does O tun ti zeh mean?",
            optionA: "Does that make sense",
            optionB: "Gone completely wild",
            optionC: "Cheap local gin",
            optionD: "Very flimsy material",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does E choke mean?",
            optionA: "Trouble comes easily",
            optionB: "Shock or amazement",
            optionC: "Most luxurious lifestyle",
            optionD: "A lunatic or scatterbrain",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Dey play mean?",
            optionA: "Elite digital escort",
            optionB: "Failing and retaking",
            optionC: "Wasting valuable time",
            optionD: "Undocumented transaction deal",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Woto woto mean?",
            optionA: "Electronic bank transfer",
            optionB: "In heavy quantities",
            optionC: "A traffic jam",
            optionD: "Problem or disaster",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Gbas gbos mean?",
            optionA: "Anti-adultery spell",
            optionB: "Shock or amazement",
            optionC: "Trade of insults",
            optionD: "Using illegal shortcut",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Vawulence mean?",
            optionA: "Online trolling chaos",
            optionB: "Strict dress code",
            optionC: "To walk around",
            optionD: "Splurging on comfort",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does No cap mean?",
            optionA: "Brutally raw honesty",
            optionB: "Burning passionate intensity",
            optionC: "Absolute truth",
            optionD: "To eat",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Who dey breathe? mean?",
            optionA: "Emergency savings buffer",
            optionB: "Bragging about luxury",
            optionC: "To permanently emigrate",
            optionD: "Motorized tricycle transport",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Shege pro max mean?",
            optionA: "Only works when watched",
            optionB: "Please",
            optionC: "Thrifted designer clothing",
            optionD: "Extreme hardship level",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Wahala be like bicycle mean?",
            optionA: "Live excessively large",
            optionB: "Trouble comes easily",
            optionC: "Man with money",
            optionD: "Renting room for sex",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Sapa Nation mean?",
            optionA: "Living on handouts",
            optionB: "Most luxurious lifestyle",
            optionC: "Currently broke people",
            optionD: "Street tout",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Ginger mean?",
            optionA: "To highly motivate",
            optionB: "How is your health?",
            optionC: "Outright cheating bias",
            optionD: "Collecting cash drops",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Shenk mean?",
            optionA: "A notorious gossip",
            optionB: "Need the restroom",
            optionC: "Trouble",
            optionD: "To deliberately ignore",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Fashi mean?",
            optionA: "To completely forget",
            optionB: "Nosy rumor carrier",
            optionC: "Wild erratic behavior",
            optionD: "Flashy behavior",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Skoin skoin mean?",
            optionA: "A crazy person",
            optionB: "Let's go",
            optionC: "Shock or amazement",
            optionD: "Gone completely wild",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does E sure for you mean?",
            optionA: "Ignoring text replies",
            optionB: "Goodbye till later",
            optionC: "Absolute confidence phrase",
            optionD: "To highly motivate",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Para mean?",
            optionA: "Bustling transit junctions",
            optionB: "To be street-smart",
            optionC: "Eat until stuffed",
            optionD: "To become enraged",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Lamba mean?",
            optionA: "A sugar daddy",
            optionB: "A generic peer",
            optionC: "A terrible personality",
            optionD: "An exaggerated lie",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Zeh mean?",
            optionA: "Flaunting wealth publicly",
            optionB: "Attain high success",
            optionC: "Discipline you thoroughly",
            optionD: "Tell them off",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Trabaye mean?",
            optionA: "Get extremely high",
            optionB: "A plump person",
            optionC: "Undocumented transaction deal",
            optionD: "Foreign secondhand goods",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Opp mean?",
            optionA: "Don't care at all",
            optionB: "A rival or enemy",
            optionC: "Exclaiming over blessings",
            optionD: "Electronic bank transfer",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does On colos mean?",
            optionA: "Under drug influence",
            optionB: "Consistent stable pace",
            optionC: "Don't care at all",
            optionD: "A deceptive strategy",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does God abeg mean?",
            optionA: "Marijuana-mixed drink",
            optionB: "With lightning speed",
            optionC: "Plea for help",
            optionD: "It is plenty",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Pressure mean?",
            optionA: "To frown",
            optionB: "Expression of shock",
            optionC: "That is true",
            optionD: "Flaunting wealth publicly",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Gaza mean?",
            optionA: "Keep investments secure",
            optionB: "Rugged and unyielding",
            optionC: "Undocumented transaction deal",
            optionD: "How is your health?",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Otilo mean?",
            optionA: "South Africa",
            optionB: "Steady cash inflow",
            optionC: "It is gone",
            optionD: "Make rivals uncomfortable",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Inside life mean?",
            optionA: "To be aggressive",
            optionB: "Reckless street behavior",
            optionC: "Rugged and unyielding",
            optionD: "Wild life realities",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Doings mean?",
            optionA: "Trade of insults",
            optionB: "To dodge bad vibes",
            optionC: "Extreme wealth display",
            optionD: "Let topic slide",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Na fine boy dey pay? mean?",
            optionA: "Overpriced Lekki lifestyle",
            optionB: "Beauty pays nothing",
            optionC: "Clinging to someone",
            optionD: "A crazy person",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Na your clear mean?",
            optionA: "Eat until stuffed",
            optionB: "Your personal choice",
            optionC: "Lighthearted life approach",
            optionD: "Underground secret dealings",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Cut soap for me mean?",
            optionA: "A true helper",
            optionB: "Ridiculously overflowing wealth",
            optionC: "Share wealth secret",
            optionD: "An expert artisan",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does E be things mean?",
            optionA: "Praising sharp intelligence",
            optionB: "Exposing someone's trouble",
            optionC: "Very strange situation",
            optionD: "A rival or enemy",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does No evidence mean?",
            optionA: "Invisible success proof",
            optionB: "Flashing luxury falsely",
            optionC: "Large frying pan",
            optionD: "Premium street marijuana",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Body dey tell me mean?",
            optionA: "Intense physical exhaustion",
            optionB: "An exaggerated lie",
            optionC: "Wild erratic behavior",
            optionD: "It is gone",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does No leave, no transfer mean?",
            optionA: "Who cares anyway?",
            optionB: "To be aggressive",
            optionC: "Deep wealth reservoir",
            optionD: "Permanently stuck situation",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Agba mean?",
            optionA: "What is unfolding?",
            optionB: "Dressing for clout",
            optionC: "A craft master",
            optionD: "Spiced beef jerky",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Steeze mean?",
            optionA: "Effortless personal style",
            optionB: "Deep wealth reservoir",
            optionC: "Warning to behave",
            optionD: "Have not eaten",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Aura mean?",
            optionA: "Illegal driver levies",
            optionB: "Heavy beating baton",
            optionC: "Cool energy projected",
            optionD: "Intense disgust",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Billionaire vibes mean?",
            optionA: "A village person",
            optionB: "It is gone",
            optionC: "Elite wealth confidence",
            optionD: "Transactional money relationship",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Onye mean?",
            optionA: "Absolute honesty space",
            optionB: "Permanently stuck situation",
            optionC: "This guy",
            optionD: "Rugged and unyielding",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Baddie mean?",
            optionA: "Toxic rodent poison",
            optionB: "Egg and noodle mix",
            optionC: "To get stuck",
            optionD: "A stylish woman",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Situation mean?",
            optionA: "Dry Garri",
            optionB: "Complicated romantic mess",
            optionC: "Absolute flat refusal",
            optionD: "Conflict has begun",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Tension mean?",
            optionA: "Ridiculous things for fame",
            optionB: "Absolute agreement exclamation",
            optionC: "Join the vibe",
            optionD: "Make rivals uncomfortable",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Collect mean?",
            optionA: "Receive rightful punishment",
            optionB: "To have casual sex",
            optionC: "Pay on delivery",
            optionD: "Pregnant outside wedlock",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Cruise mean?",
            optionA: "Customized luxury jewelry",
            optionB: "Lighthearted life approach",
            optionC: "Top authority figure",
            optionD: "Problem or disaster",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does E don happen mean?",
            optionA: "Total complete failure",
            optionB: "Scenario has occurred",
            optionC: "Attracting female buyers",
            optionD: "To get stuck",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Over-packaging mean?",
            optionA: "Oversized and untidy",
            optionB: "Fake wealth impression",
            optionC: "Cheap fast meals",
            optionD: "Serving something fresh",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Swerve mean?",
            optionA: "Premium quality standard",
            optionB: "Profound shock exclamation",
            optionC: "Rich dark complexion",
            optionD: "To dodge bad vibes",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Up to speed mean?",
            optionA: "Man with money",
            optionB: "An internet scammer",
            optionC: "Aware of gossip",
            optionD: "Explosion of trouble",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Buss down mean?",
            optionA: "To utter words",
            optionB: "School childhood lover",
            optionC: "Customized luxury jewelry",
            optionD: "Elite wealth confidence",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Big tech mean?",
            optionA: "Hustle never collapse",
            optionB: "An insatiable glutton",
            optionC: "To act crazy",
            optionD: "Tech foreign currency earners",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Mint mean?",
            optionA: "Goodbye see you",
            optionB: "Brand new currency",
            optionC: "Marrying up class",
            optionD: "Deep emotional sorrow",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Waybill mean?",
            optionA: "Spend recklessly always",
            optionB: "Transport via buses",
            optionC: "To frown",
            optionD: "Pay maximum attention",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Bail mean?",
            optionA: "Premium quality standard",
            optionB: "Flashy behavior",
            optionC: "Problem or disaster",
            optionD: "Provide financial relief",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Over-invoice mean?",
            optionA: "How's the vibe?",
            optionB: "Living on handouts",
            optionC: "Inflate official price",
            optionD: "Execute task successfully",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Run am mean?",
            optionA: "Traditional uniform outfits",
            optionB: "Generic leather footwear",
            optionC: "Execute task successfully",
            optionD: "To get angry",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Aza man mean?",
            optionA: "Money",
            optionB: "To get stuck",
            optionC: "Tiny mocking amount",
            optionD: "Trusted account owner",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Wire mean?",
            optionA: "Stop heavy English",
            optionB: "Stay vigilant always",
            optionC: "Electronic bank transfer",
            optionD: "Marrying up class",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Clearing mean?",
            optionA: "Settling outstanding debt",
            optionB: "A Lagos slang",
            optionC: "Doing it secretly",
            optionD: "To get stuck",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Chop life mean?",
            optionA: "Street tout",
            optionB: "Anti-adultery spell",
            optionC: "A lavish party",
            optionD: "Splurging on comfort",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Client mean?",
            optionA: "Foreign scam target",
            optionB: "Outright cheating bias",
            optionC: "Absolute honesty space",
            optionD: "A lunatic or scatterbrain",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Format mean?",
            optionA: "Burning passionate intensity",
            optionB: "A deceptive strategy",
            optionC: "Pledging trend loyalty",
            optionD: "Sweet tender romance",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Loading mean?",
            optionA: "Using illegal shortcut",
            optionB: "Transfer still processing",
            optionC: "Just coasting along",
            optionD: "A sugar daddy",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Billing mean?",
            optionA: "Conflict has begun",
            optionB: "To have casual sex",
            optionC: "Endless money requests",
            optionD: "Trouble",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Urgent 2k mean?",
            optionA: "To die",
            optionB: "Total complete failure",
            optionC: "Small emergency cash",
            optionD: "Praising sharp intelligence",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Cabash mean?",
            optionA: "Flaunting wealth publicly",
            optionB: "Official primary partner",
            optionC: "Spend recklessly always",
            optionD: "Funds from victims",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Yahoo boy mean?",
            optionA: "Total complete failure",
            optionB: "Senior who bullies",
            optionC: "An internet scammer",
            optionD: "A know-it-all",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Yahoo plus mean?",
            optionA: "Deep wealth reservoir",
            optionB: "Spiritually enhanced fraud",
            optionC: "A sharp retort",
            optionD: "Gone completely wild",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Settlement mean?",
            optionA: "A young girlfriend",
            optionB: "Paying street actors",
            optionC: "A wealthy person",
            optionD: "Dark magic arranged",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Sharp-sharp mean?",
            optionA: "A terrible personality",
            optionB: "To be street-smart",
            optionC: "Feeling physical pain",
            optionD: "With lightning speed",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Under-G runs mean?",
            optionA: "Local canteen vendor",
            optionB: "A sharp retort",
            optionC: "Final destination always",
            optionD: "Underground secret dealings",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Side hustle mean?",
            optionA: "A painful knock",
            optionB: "Secondary income stream",
            optionC: "To arrive",
            optionD: "Specific people category",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Buka mean?",
            optionA: "Something great happens",
            optionB: "Cheap local restaurant",
            optionC: "Let's go",
            optionD: "Ridiculous things for fame",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Mama Put mean?",
            optionA: "A bald head",
            optionB: "Driving very fast",
            optionC: "Living on handouts",
            optionD: "Local food vendor",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Change am for you mean?",
            optionA: "Switch to anger",
            optionB: "Is this enough?",
            optionC: "A terrible personality",
            optionD: "Absolute agreement exclamation",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Drop bar mean?",
            optionA: "Paying under pressure",
            optionB: "Keep opinions private",
            optionC: "Need the restroom",
            optionD: "Dedicated academic bookworm",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Cashout mean?",
            optionA: "Major deal success",
            optionB: "To break down",
            optionC: "Flashy behavior",
            optionD: "It is gone",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Plugs mean?",
            optionA: "Legendary street figure",
            optionB: "Deep emotional sorrow",
            optionC: "Connected street contact",
            optionD: "Local distilled palm gin",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Dealer mean?",
            optionA: "Sells imported cars",
            optionB: "Cheap fast meals",
            optionC: "Wild youth nightlife",
            optionD: "Sexual penetration act",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Sabi man mean?",
            optionA: "Shock or amazement",
            optionB: "Who cares anyway?",
            optionC: "Fake wealth impression",
            optionD: "An expert artisan",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Workman mean?",
            optionA: "Utter total failure",
            optionB: "Bank account number",
            optionC: "Neighborhood touts",
            optionD: "Local hired contractor",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Flenjo mean?",
            optionA: "Broadcasting secrets publicly",
            optionB: "Wild youth nightlife",
            optionC: "Live excessively large",
            optionD: "Trusted account owner",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Shine mean?",
            optionA: "Ridiculously overflowing wealth",
            optionB: "Financial breakthrough season",
            optionC: "Very flimsy material",
            optionD: "Finding comedy in stress",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Pepper rest mean?",
            optionA: "A Lagos slang",
            optionB: "Deep wealth reservoir",
            optionC: "Joint street collusion",
            optionD: "To eat",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Hold your side mean?",
            optionA: "Local distilled palm gin",
            optionB: "Sudden financial blessing",
            optionC: "A wealthy person",
            optionD: "Keep investments secure",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Cut corner mean?",
            optionA: "Deeply envious feeling",
            optionB: "Get extremely high",
            optionC: "Join the vibe",
            optionD: "Using illegal shortcut",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Gbagbe mean?",
            optionA: "A dead matter",
            optionB: "Steady cash inflow",
            optionC: "A slim woman",
            optionD: "Leaked exam answers",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Heavy bar mean?",
            optionA: "Immense financial backing",
            optionB: "Local canteen vendor",
            optionC: "Customized luxury jewelry",
            optionD: "Pay on delivery",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Mio raye kaye mean?",
            optionA: "Negative boring energy",
            optionB: "Don't care at all",
            optionC: "Traffic enforcement officials",
            optionD: "No nonsense time",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does High side mean?",
            optionA: "Expensive neighbourhood living",
            optionB: "Complete structural ruin",
            optionC: "A traffic jam",
            optionD: "Money or cash",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Mainland standard mean?",
            optionA: "United States",
            optionB: "Sturdy everyday items",
            optionC: "It is gone",
            optionD: "Internet fraudsters",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Tokunbo mean?",
            optionA: "Discussion officially closed",
            optionB: "Kola to stay awake",
            optionC: "Foreign secondhand goods",
            optionD: "Leaked exam answers",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Bend-down-select mean?",
            optionA: "Arrogant proud attitude",
            optionB: "Absolute agreement exclamation",
            optionC: "Thrifting for clothes",
            optionD: "To have sex",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Okrika mean?",
            optionA: "Party and dance out",
            optionB: "Flashy behavior",
            optionC: "Thrifted designer clothing",
            optionD: "Ignoring text replies",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gbalayan mean?",
            optionA: "Strictly follows rules",
            optionB: "Sweet tender romance",
            optionC: "Commercial sex worker",
            optionD: "Oversized and untidy",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Chop eye mean?",
            optionA: "Cheat someone subtly",
            optionB: "Finding comedy in stress",
            optionC: "Renting room for sex",
            optionD: "Sends account to admirers",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Bonus mean?",
            optionA: "Get extremely high",
            optionB: "Someone acting soft",
            optionC: "Have significant money",
            optionD: "Flashing luxury falsely",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Market block mean?",
            optionA: "Strategic haggling spot",
            optionB: "United States",
            optionC: "Living on handouts",
            optionD: "Keep opinions private",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Bail out mean?",
            optionA: "Pay to impress",
            optionB: "Spending carelessly always",
            optionC: "To give gifts",
            optionD: "Standing firmly unshaken",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does I dey mean?",
            optionA: "Scanning your environment",
            optionB: "I am fine",
            optionC: "Unregistered taxi",
            optionD: "An extramarital affair",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does How bodi? mean?",
            optionA: "Undocumented transaction deal",
            optionB: "Sells imported cars",
            optionC: "Improving overall lifestyle",
            optionD: "How is your health?",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Wetin dey happen? mean?",
            optionA: "Elite digital escort",
            optionB: "Your personal choice",
            optionC: "What is unfolding?",
            optionD: "Everyone has secrets",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Comot for road mean?",
            optionA: "Raw and unfiltered",
            optionB: "Overpriced Lekki lifestyle",
            optionC: "Get out now",
            optionD: "Bragging about luxury",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does K-leg mean?",
            optionA: "Flashy mismatched colors",
            optionB: "Receive rightful punishment",
            optionC: "Intense physical exhaustion",
            optionD: "A messy complication",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Butta my bread mean?",
            optionA: "An internet scammer",
            optionB: "Don't care at all",
            optionC: "Gone completely wild",
            optionD: "Sudden financial blessing",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does I go land you slap mean?",
            optionA: "Trend-aware person",
            optionB: "Physical hitting threat",
            optionC: "To walk around",
            optionD: "Party and dance out",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Listen well-well mean?",
            optionA: "It is gone",
            optionB: "Pulling seniority rank",
            optionC: "Goodbye till later",
            optionD: "Pay maximum attention",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Wetin Musa no go see? mean?",
            optionA: "Witnessing absurd sight",
            optionB: "Spending carelessly always",
            optionC: "Motorized tricycle transport",
            optionD: "Wasting valuable time",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Carry eye go market mean?",
            optionA: "Scanning your environment",
            optionB: "Clinging to someone",
            optionC: "Day after tomorrow",
            optionD: "Gone completely wild",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does I jus dey mean?",
            optionA: "To physically overpower",
            optionB: "Just coasting along",
            optionC: "A white person",
            optionD: "The United Kingdom",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Your head dey there mean?",
            optionA: "Praising sharp intelligence",
            optionB: "Goodbye till later",
            optionC: "Tell them off",
            optionD: "Extreme hardship level",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does As e dey hot mean?",
            optionA: "Physical hitting threat",
            optionB: "Money",
            optionC: "Serving something fresh",
            optionD: "Funds from victims",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Ayama mean?",
            optionA: "Using illegal shortcut",
            optionB: "To become enraged",
            optionC: "Shock or amazement",
            optionD: "Intense disgust",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Bad-belle mean?",
            optionA: "Reckless street behavior",
            optionB: "That is true",
            optionC: "Dance floor command",
            optionD: "A very jealous person",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Belleful mean?",
            optionA: "Doing it secretly",
            optionB: "Spend recklessly always",
            optionC: "Eat until stuffed",
            optionD: "Exactly!",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Bonga-fish mean?",
            optionA: "Elite standing person",
            optionB: "To eat",
            optionC: "Popular social figure",
            optionD: "An extremely thin person",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Break-bottle mean?",
            optionA: "A male companion",
            optionB: "Don't care at all",
            optionC: "At the end",
            optionD: "Speaking broken English",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Bole mean?",
            optionA: "Transport via buses",
            optionB: "Native roasted plantain",
            optionC: "Verifying bank account",
            optionD: "Yoruba accent mimicry",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Backhand mean?",
            optionA: "Sneak away quietly",
            optionB: "The human buttocks",
            optionC: "An expert artisan",
            optionD: "A reverse slap",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Aproko mean?",
            optionA: "Invisible success proof",
            optionB: "A sharp retort",
            optionC: "A crazy person",
            optionD: "A notorious gossip",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Away goal mean?",
            optionA: "Pregnant outside wedlock",
            optionB: "A terrible personality",
            optionC: "To physically overpower",
            optionD: "To permanently emigrate",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Away match mean?",
            optionA: "Bus fare collector",
            optionB: "An extramarital affair",
            optionC: "Local canteen vendor",
            optionD: "To leave",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Blacky mean?",
            optionA: "An unexpected calamity",
            optionB: "Deeply envious feeling",
            optionC: "A sharp retort",
            optionD: "Rich dark complexion",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does I pass my neighbour mean?",
            optionA: "Small portable generator",
            optionB: "Wit needed to survive",
            optionC: "Very flimsy material",
            optionD: "Provide financial relief",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does I wan ease myself mean?",
            optionA: "With lightning speed",
            optionB: "Bus fare collector",
            optionC: "Need the restroom",
            optionD: "Overpriced Lekki lifestyle",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does I wash my hands mean?",
            optionA: "Completely walking away",
            optionB: "Traditional uniform outfits",
            optionC: "Multiple electronic transfers",
            optionD: "Tech foreign currency earners",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Ibile mean?",
            optionA: "Illegal driver levies",
            optionB: "Small emergency cash",
            optionC: "Strategic haggling spot",
            optionD: "A village person",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Indomie lifestyle mean?",
            optionA: "Cheap fast meals",
            optionB: "Brand new",
            optionC: "To die",
            optionD: "Exactly!",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Insert SIM mean?",
            optionA: "Who cares anyway?",
            optionB: "Pretending not to hear",
            optionC: "Sexual penetration act",
            optionD: "Strictly follows rules",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Isi ewu mean?",
            optionA: "Soft local bread",
            optionB: "Spiced goat head",
            optionC: "Exclaiming someone's beauty",
            optionD: "Join the vibe",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Iwere mean?",
            optionA: "Rich dark complexion",
            optionB: "Extra large blessing",
            optionC: "No nonsense time",
            optionD: "A lunatic or scatterbrain",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Iya Basira mean?",
            optionA: "Commercial sex worker",
            optionB: "Dance floor command",
            optionC: "Transactional sexual arrangement",
            optionD: "Local canteen vendor",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Iyawo mean?",
            optionA: "Join the vibe",
            optionB: "Transport via buses",
            optionC: "To break down",
            optionD: "A married woman",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Cram mean?",
            optionA: "Man with money",
            optionB: "Memorizing without understanding",
            optionC: "Cooked cow skin",
            optionD: "Cutting communication instantly",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Padiwise mean?",
            optionA: "Disappoint someone",
            optionB: "Brutally raw honesty",
            optionC: "Splurging on comfort",
            optionD: "Joint street collusion",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Tok mean?",
            optionA: "To utter words",
            optionB: "A lavish party",
            optionC: "Hustle never collapse",
            optionD: "Flashy mismatched colors",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Shady mean?",
            optionA: "Negative boring energy",
            optionB: "A sex worker",
            optionC: "Untrustworthy behavior",
            optionD: "Platonic opposite-sex friendship",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Shanga mean?",
            optionA: "Flashy mismatched colors",
            optionB: "A sex worker",
            optionC: "Complicated romantic mess",
            optionD: "Intense disgust",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does I dey fear mean?",
            optionA: "Tiny mocking amount",
            optionB: "Rich dark complexion",
            optionC: "Everything fully ready",
            optionD: "Sudden fear feeling",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does I dey ache mean?",
            optionA: "To break down",
            optionB: "Feeling physical pain",
            optionC: "Deep emotional sorrow",
            optionD: "Deeply envious feeling",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does I dey H mean?",
            optionA: "To become enraged",
            optionB: "Being very hungry",
            optionC: "Female buttocks",
            optionD: "Sudden fear feeling",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does I don die mean?",
            optionA: "Let's go",
            optionB: "Youth Corps members",
            optionC: "To eat",
            optionD: "In massive trouble",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does I fit mean?",
            optionA: "Fully capable person",
            optionB: "Pay maximum attention",
            optionC: "Living on handouts",
            optionD: "A gossip",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does I full ground remain mean?",
            optionA: "Fully ready always",
            optionB: "A lavish party",
            optionC: "Overpriced Lekki lifestyle",
            optionD: "Complete structural ruin",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does I go cure your craze mean?",
            optionA: "We move forward",
            optionB: "Discipline you thoroughly",
            optionC: "A respected person",
            optionD: "Brand new",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does I never chop mean?",
            optionA: "A private ride",
            optionB: "Have not eaten",
            optionC: "Let topic slide",
            optionD: "To frown",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does I no send mean?",
            optionA: "Yellow commercial bus",
            optionB: "Don't care at all",
            optionC: "Physically intercept someone",
            optionD: "To talk",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does I no well mean?",
            optionA: "Feeling physically sick",
            optionB: "A scary masquerade",
            optionC: "Shocking upcoming success",
            optionD: "Exposing someone's trouble",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Aircon mean?",
            optionA: "Expression of shock",
            optionB: "Sudden fear feeling",
            optionC: "Intense frustration exclamation",
            optionD: "Air conditioning unit",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Daba mean?",
            optionA: "Burning passionate intensity",
            optionB: "To physically overpower",
            optionC: "Have significant money",
            optionD: "Discussion officially closed",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Form mean?",
            optionA: "Commercial sex worker",
            optionB: "Fake artificial persona",
            optionC: "To completely forget",
            optionD: "Spiced goat head",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gbege mean?",
            optionA: "In heavy quantities",
            optionB: "Explosion of trouble",
            optionC: "Underground secret dealings",
            optionD: "Glamorous uniform clique",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Gberu mean?",
            optionA: "Trouble comes easily",
            optionB: "No problem",
            optionC: "Rugged and unyielding",
            optionD: "Street luggage",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Kwasuka mean?",
            optionA: "Scanning your environment",
            optionB: "A true helper",
            optionC: "Police officers",
            optionD: "Complete structural ruin",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Lebe mean?",
            optionA: "Don't care at all",
            optionB: "Generic rubber slippers",
            optionC: "A reverse slap",
            optionD: "Dangling skin piece",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Magun mean?",
            optionA: "Large frying pan",
            optionB: "Left haters speechless",
            optionC: "Deep emotional sorrow",
            optionD: "Anti-adultery spell",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Nyash mean?",
            optionA: "The human buttocks",
            optionB: "Under drug influence",
            optionC: "Physical cash",
            optionD: "Alcoholic drinks",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Ojoro mean?",
            optionA: "To have casual sex",
            optionB: "Trend-aware person",
            optionC: "Outright cheating bias",
            optionD: "Sudden financial blessing",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Okpetu mean?",
            optionA: "The ghetto",
            optionB: "Sturdy everyday items",
            optionC: "Isn't it?",
            optionD: "An unexpected calamity",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Otapiapia mean?",
            optionA: "Toxic rodent poison",
            optionB: "Unregistered taxi",
            optionC: "Marrying up class",
            optionD: "Emergency savings buffer",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Raba mean?",
            optionA: "Premium quality standard",
            optionB: "Burning passionate intensity",
            optionC: "Money or cash",
            optionD: "A messy complication",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Shenge mean?",
            optionA: "The United Kingdom",
            optionB: "Tiny mocking amount",
            optionC: "An expert artisan",
            optionD: "Oversized and untidy",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Soor mean?",
            optionA: "Join the vibe",
            optionB: "An elevated bridge",
            optionC: "To get angry",
            optionD: "Shut up now",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Taku mean?",
            optionA: "To get stuck",
            optionB: "Exclaiming someone's beauty",
            optionC: "Elite digital escort",
            optionD: "Pulling seniority rank",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Unilag lifestyle mean?",
            optionA: "School childhood lover",
            optionB: "Permanently stuck situation",
            optionC: "Wild youth nightlife",
            optionD: "Where is my money?",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Wobia mean?",
            optionA: "An insatiable glutton",
            optionB: "Shocking upcoming success",
            optionC: "Flashy mismatched colors",
            optionD: "Elite standing person",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Yanga mean?",
            optionA: "Endorse romantic pairing",
            optionB: "Make rivals uncomfortable",
            optionC: "Spaghetti and beans",
            optionD: "Proud arrogant posturing",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Zanga mean?",
            optionA: "Wasting valuable time",
            optionB: "To feel safe",
            optionC: "Total complete failure",
            optionD: "The deep ghetto",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Kpansh mean?",
            optionA: "Specific people category",
            optionB: "A young woman",
            optionC: "To have casual sex",
            optionD: "Expensive clothes",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Kpako mean?",
            optionA: "Pledging trend loyalty",
            optionB: "A plump person",
            optionC: "Let topic slide",
            optionD: "Tough unyielding person",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Leke leke mean?",
            optionA: "A cattle egret",
            optionB: "South Africa",
            optionC: "To feel safe",
            optionD: "Everyone has secrets",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Manya mean?",
            optionA: "Arrogant proud attitude",
            optionB: "Become blissfully drunk",
            optionC: "Wealthy free spender",
            optionD: "Great marriage material",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Ngbati ngbati mean?",
            optionA: "A bribe",
            optionB: "A plump person",
            optionC: "Yoruba accent mimicry",
            optionD: "Emergency savings buffer",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Oda mean?",
            optionA: "It is fine",
            optionB: "Losing all patience",
            optionC: "How's the vibe?",
            optionD: "Who cares anyway?",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Odor mean?",
            optionA: "Losing all patience",
            optionB: "Elite wealth confidence",
            optionC: "A terrible personality",
            optionD: "In massive trouble",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Oyinbo pepper mean?",
            optionA: "Fair-skin teasing nickname",
            optionB: "Explosion of trouble",
            optionC: "Official primary partner",
            optionD: "Shock or amazement",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Skelewu mean?",
            optionA: "Legendary street figure",
            optionB: "A vintage dance",
            optionC: "Local food vendor",
            optionD: "A grammatical error",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Talo nko? mean?",
            optionA: "Sudden fear feeling",
            optionB: "Negative boring energy",
            optionC: "Who cares anyway?",
            optionD: "To walk around",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Ukwu mean?",
            optionA: "Lighthearted life approach",
            optionB: "Pronounced female hips",
            optionC: "Scanning your environment",
            optionD: "Steady cash inflow",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Woko mean?",
            optionA: "Undocumented transaction deal",
            optionB: "Trend-aware person",
            optionC: "Large frying pan",
            optionD: "Sends account to admirers",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Yadi mean?",
            optionA: "Man with money",
            optionB: "A sugar daddy",
            optionC: "Fabric yard material",
            optionD: "Commercial sex worker",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Zuzu mean?",
            optionA: "Regulated bus transport",
            optionB: "Wild erratic behavior",
            optionC: "Painful romantic breakup",
            optionD: "A traffic jam",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Choko mean?",
            optionA: "Losing all patience",
            optionB: "Tea and egg vendor",
            optionC: "Driving very fast",
            optionD: "Hopeful sign-off phrase",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does E don set mean?",
            optionA: "Stable responsible man",
            optionB: "Yoruba accent mimicry",
            optionC: "Everything fully ready",
            optionD: "Local distilled palm gin",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Gbese mean?",
            optionA: "Eat until stuffed",
            optionB: "An elevated bridge",
            optionC: "A massive debt",
            optionD: "Having zero money",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Josi mean?",
            optionA: "A lunatic or scatterbrain",
            optionB: "Fake wealth impression",
            optionC: "Join the vibe",
            optionD: "Spend recklessly always",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Kele mean?",
            optionA: "Become hyper-aggressive",
            optionB: "Spiced goat head",
            optionC: "A young girlfriend",
            optionD: "Senior who bullies",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Mopo mean?",
            optionA: "Plea for help",
            optionB: "Brutally raw honesty",
            optionC: "Mobile Police officers",
            optionD: "An elevated bridge",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Nkan be mean?",
            optionA: "Strange things happening",
            optionB: "Vibe someone brings",
            optionC: "A wealthy person",
            optionD: "Mean and stingy",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Opor mean?",
            optionA: "Someone acting soft",
            optionB: "Man with money",
            optionC: "It is plenty",
            optionD: "Always in library",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Runs girl mean?",
            optionA: "A rival or enemy",
            optionB: "Transactional money relationship",
            optionC: "A messy complication",
            optionD: "Tough unyielding person",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Shayo mean?",
            optionA: "Hard alcohol drink",
            optionB: "A gossip",
            optionC: "Tell them off",
            optionD: "Showing off achievements",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Tuale mean?",
            optionA: "Respectful street salute",
            optionB: "Make rivals uncomfortable",
            optionC: "Expression of shock",
            optionD: "A young woman",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Wasiu mean?",
            optionA: "Yellow commercial bus",
            optionB: "Faking official status",
            optionC: "Hyper street guy",
            optionD: "Who cares anyway?",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Yawa mean?",
            optionA: "Internet fraudsters",
            optionB: "Someone acting soft",
            optionC: "A married woman",
            optionD: "Problem or disaster",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Zamo mean?",
            optionA: "It is plenty",
            optionB: "Sneak away quietly",
            optionC: "Does that make sense",
            optionD: "Spending carelessly always",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Kpa mean?",
            optionA: "Money or cash",
            optionB: "Tea and egg vendor",
            optionC: "Peaceful goodnight sign-off",
            optionD: "Extra large blessing",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Fia mean?",
            optionA: "Overpriced Lekki lifestyle",
            optionB: "Dark magic arranged",
            optionC: "Let's go",
            optionD: "Burning passionate intensity",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does O shock wan mean?",
            optionA: "Physical hitting threat",
            optionB: "Outright cheating bias",
            optionC: "Multiple electronic transfers",
            optionD: "Left haters speechless",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Task force mean?",
            optionA: "Street trader raiders",
            optionB: "To act crazy",
            optionC: "Local hired contractor",
            optionD: "Dried cassava salad",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does One-way mean?",
            optionA: "Driving against traffic",
            optionB: "Matching cool energy",
            optionC: "Keeping it secret",
            optionD: "Intense physical exhaustion",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Yellow fever mean?",
            optionA: "Traffic enforcement officials",
            optionB: "Pay on delivery",
            optionC: "Lighthearted life approach",
            optionD: "Sends account to admirers",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Marwa mean?",
            optionA: "An insatiable glutton",
            optionB: "Motorized tricycle transport",
            optionC: "Unregistered taxi",
            optionD: "Absolute agreement exclamation",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Conductor mean?",
            optionA: "Money",
            optionB: "Shock or amazement",
            optionC: "Bus fare collector",
            optionD: "Aware of gossip",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Owo mi da? mean?",
            optionA: "Stop heavy English",
            optionB: "Driving very fast",
            optionC: "Where is my money?",
            optionD: "Overly clingy partner",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Last bus stop mean?",
            optionA: "Final destination always",
            optionB: "School childhood lover",
            optionC: "Excelling in exams",
            optionD: "To run away",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Hold your change mean?",
            optionA: "What is happening?",
            optionB: "Brand new currency",
            optionC: "Have smaller change",
            optionD: "Official primary partner",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Enter line mean?",
            optionA: "Flashing luxury falsely",
            optionB: "Standard street protocol",
            optionC: "Arrogant proud attitude",
            optionD: "A messy complication",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Lekki standard mean?",
            optionA: "Hailing cheap private ride",
            optionB: "Become hyper-aggressive",
            optionC: "Overpriced Lekki lifestyle",
            optionD: "Does that make sense",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Third Mainland run mean?",
            optionA: "Driving very fast",
            optionB: "Refined polished person",
            optionC: "Spiced goat head",
            optionD: "An extramarital affair",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Under bridge mean?",
            optionA: "Execute task successfully",
            optionB: "To leave",
            optionC: "Bustling transit junctions",
            optionD: "How's the vibe?",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Express mean?",
            optionA: "Tiny mocking amount",
            optionB: "Gone completely wild",
            optionC: "Wide fast highway",
            optionD: "A traffic jam",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Flyover mean?",
            optionA: "An elevated bridge",
            optionB: "Endless life problems",
            optionC: "Nosy rumor carrier",
            optionD: "Overpriced Lekki lifestyle",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does BRT mean?",
            optionA: "Pledging trend loyalty",
            optionB: "Regulated bus transport",
            optionC: "Street tout",
            optionD: "Immense financial backing",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Staff mean?",
            optionA: "Renting room for sex",
            optionB: "Exposing someone's trouble",
            optionC: "Faking official status",
            optionD: "Attracting female buyers",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Chance mean?",
            optionA: "Excelling in exams",
            optionB: "A young woman",
            optionC: "In heavy quantities",
            optionD: "Squeeze into space",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Laulau mean?",
            optionA: "At the end",
            optionB: "Where is my money?",
            optionC: "Street tout",
            optionD: "Spending carelessly always",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Bolekaja mean?",
            optionA: "A sharp retort",
            optionB: "Currently broke people",
            optionC: "Vintage wooden truck",
            optionD: "A white person",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Go-slow traffic mean?",
            optionA: "Look completely unbothered",
            optionB: "Painful gridlock traffic",
            optionC: "Hearing juicy gossip",
            optionD: "A lavish party",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Soole mean?",
            optionA: "Hailing cheap private ride",
            optionB: "Reading someone's energy",
            optionC: "Complete structural ruin",
            optionD: "Specific people category",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Drop taxi mean?",
            optionA: "Always in library",
            optionB: "It is gone",
            optionC: "Hiring vehicle privately",
            optionD: "Chill and relax",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Agbero taxForce mean?",
            optionA: "Illegal driver levies",
            optionB: "Outright cheating bias",
            optionC: "Lavish spender person",
            optionD: "No problem",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Clear eye mean?",
            optionA: "Coolness measuring metric",
            optionB: "I am fine",
            optionC: "Calm sensible view",
            optionD: "Stable responsible man",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Lambo drive mean?",
            optionA: "Execute task successfully",
            optionB: "Share wealth secret",
            optionC: "Hearing juicy gossip",
            optionD: "Flashing luxury falsely",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Catch cruise mean?",
            optionA: "Finding comedy in stress",
            optionB: "Paying under pressure",
            optionC: "Get out now",
            optionD: "Reading someone's energy",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Street smart mean?",
            optionA: "Matching cool energy",
            optionB: "Yoruba accent mimicry",
            optionC: "Sweet tender romance",
            optionD: "Wit needed to survive",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Ojuju mean?",
            optionA: "A scary masquerade",
            optionB: "Everything under control",
            optionC: "Intense frustration exclamation",
            optionD: "To deliberately ignore",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gengen mean?",
            optionA: "Showing off achievements",
            optionB: "Dramatic live situation",
            optionC: "Feeling physically sick",
            optionD: "Goodbye see you",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does No network mean?",
            optionA: "Generic rubber slippers",
            optionB: "Keep investments secure",
            optionC: "Please",
            optionD: "Pretending not to hear",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Drop it mean?",
            optionA: "Physical cash",
            optionB: "Rich dark complexion",
            optionC: "Alcoholic drinks",
            optionD: "Let topic slide",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Abe-igi mean?",
            optionA: "An expert artisan",
            optionB: "No nonsense time",
            optionC: "Isn't it?",
            optionD: "Open-air relaxation spot",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Supa mean?",
            optionA: "I disagree",
            optionB: "Burning passionate intensity",
            optionC: "A respected person",
            optionD: "A bribe",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Block mean?",
            optionA: "Burning passionate intensity",
            optionB: "Spiritually enhanced fraud",
            optionC: "Do not break",
            optionD: "Physically intercept someone",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Gbe mean?",
            optionA: "Burning passionate intensity",
            optionB: "It is fine",
            optionC: "To become enraged",
            optionD: "Exposing someone's trouble",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Olosho mean?",
            optionA: "Commercial sex worker",
            optionB: "Day after tomorrow",
            optionC: "Bribing for grades",
            optionD: "This guy",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Runz mean?",
            optionA: "Undocumented transaction deal",
            optionB: "Arrogant proud attitude",
            optionC: "A bald head",
            optionD: "Elite digital escort",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Fine girl mean?",
            optionA: "Bustling transit junctions",
            optionB: "Faking official status",
            optionC: "Attracting female buyers",
            optionD: "Trouble",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Chairman mean?",
            optionA: "Is this enough?",
            optionB: "Man with money",
            optionC: "A vintage dance",
            optionD: "Faking official status",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Senior man mean?",
            optionA: "I am fine",
            optionB: "Wild life realities",
            optionC: "Elite standing person",
            optionD: "Dried cassava salad",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Oba mean?",
            optionA: "Hearing juicy gossip",
            optionB: "Field dominating guy",
            optionC: "Money",
            optionD: "Lavish spender person",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Chief mean?",
            optionA: "Gone completely wild",
            optionB: "How is your health?",
            optionC: "Being very hungry",
            optionD: "Lavish spender person",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Baddo mean?",
            optionA: "Lighthearted life approach",
            optionB: "Legendary street figure",
            optionC: "Wealthy influential pastor",
            optionD: "Calm then chaos",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does G-boys mean?",
            optionA: "Leaked exam answers",
            optionB: "Internet fraudsters",
            optionC: "Have significant money",
            optionD: "Thrifting for clothes",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Wire-wire mean?",
            optionA: "Multiple electronic transfers",
            optionB: "Brutally raw honesty",
            optionC: "Finding comedy in stress",
            optionD: "Cow foot dish",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Mugu money mean?",
            optionA: "Under drug influence",
            optionB: "Wit needed to survive",
            optionC: "Funds from victims",
            optionD: "Renting room for sex",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Aza check mean?",
            optionA: "Unregistered taxi",
            optionB: "Everyone has secrets",
            optionC: "Proud arrogant posturing",
            optionD: "Verifying bank account",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Pick up mean?",
            optionA: "Stay vigilant always",
            optionB: "Let's go",
            optionC: "Exclaiming over blessings",
            optionD: "Collecting cash drops",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Cash and carry mean?",
            optionA: "Brutally raw honesty",
            optionB: "Transfer still processing",
            optionC: "Standard street protocol",
            optionD: "Pay on delivery",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Settle matter mean?",
            optionA: "Settling dispute with cash",
            optionB: "Expression of shock",
            optionC: "Thrifting for clothes",
            optionD: "Hyper street guy",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Coded mean?",
            optionA: "Keeping it secret",
            optionB: "Isn't it?",
            optionC: "Suffer brutal heartbreak",
            optionD: "Someone acting soft",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Lowkey mean?",
            optionA: "Doing it secretly",
            optionB: "Pay on delivery",
            optionC: "School childhood lover",
            optionD: "Bus fare collector",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Ship mean?",
            optionA: "Endorse romantic pairing",
            optionB: "Execute task successfully",
            optionC: "To have casual sex",
            optionD: "Local kiosk operators",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Breakfast mean?",
            optionA: "Absolute confidence phrase",
            optionB: "Squeeze into space",
            optionC: "Painful romantic breakup",
            optionD: "Were you sent?",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Serve breakfast mean?",
            optionA: "Hearing juicy gossip",
            optionB: "Police officers",
            optionC: "Dump partner unexpectedly",
            optionD: "A rugged person",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Chop breakfast mean?",
            optionA: "Suffer brutal heartbreak",
            optionB: "Strict religious woman",
            optionC: "Shut up now",
            optionD: "To physically overpower",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Ghosting mean?",
            optionA: "To get angry",
            optionB: "An extra portion",
            optionC: "Discussion officially closed",
            optionD: "Cutting communication instantly",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Left on read mean?",
            optionA: "To deliberately ignore",
            optionB: "A notorious gossip",
            optionC: "A close friend",
            optionD: "Ignoring text replies",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Vibe killer mean?",
            optionA: "Plea for help",
            optionB: "Negative boring energy",
            optionC: "United States",
            optionD: "Cool energy projected",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Slay Queen mean?",
            optionA: "Everyone has secrets",
            optionB: "A massive debt",
            optionC: "Dressing for clout",
            optionD: "Hopeful sign-off phrase",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Oga manual mean?",
            optionA: "Overly clingy partner",
            optionB: "Strictly follows rules",
            optionC: "Scanning your environment",
            optionD: "Inflate official price",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Hookup mean?",
            optionA: "A wealthy person",
            optionB: "Join the vibe",
            optionC: "Transactional sexual arrangement",
            optionD: "To die",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Bestie mean?",
            optionA: "Paying street actors",
            optionB: "Platonic opposite-sex friendship",
            optionC: "Local food vendor",
            optionD: "Absolute agreement exclamation",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Spamming mean?",
            optionA: "Party and dance out",
            optionB: "Collecting cash drops",
            optionC: "Overwhelming with texts",
            optionD: "Emergency savings buffer",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Carry head mean?",
            optionA: "A young girlfriend",
            optionB: "Flashing luxury falsely",
            optionC: "Spending carelessly always",
            optionD: "Arrogant proud attitude",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Bone face mean?",
            optionA: "Burning passionate intensity",
            optionB: "Maintain a frown",
            optionC: "It is fine",
            optionD: "Neighborhood touts",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Cut off mean?",
            optionA: "Money or cash",
            optionB: "Top authority figure",
            optionC: "Hearing juicy gossip",
            optionD: "Cutting toxic friends",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Oppressed mean?",
            optionA: "Secondary income stream",
            optionB: "A sugar daddy",
            optionC: "Wild youth nightlife",
            optionD: "Deeply envious feeling",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Upgrade mean?",
            optionA: "Improving overall lifestyle",
            optionB: "Great marriage material",
            optionC: "Chill and relax",
            optionD: "Finding comedy in stress",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Woke mean?",
            optionA: "Live excessively large",
            optionB: "Trend-aware person",
            optionC: "Kola to stay awake",
            optionD: "Share wealth secret",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Flexing mean?",
            optionA: "Online trolling chaos",
            optionB: "Clinging to someone",
            optionC: "Showing off achievements",
            optionD: "Excelling in exams",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Clout chasing mean?",
            optionA: "Showing off achievements",
            optionB: "Ridiculous things for fame",
            optionC: "Flashy mismatched colors",
            optionD: "Immense financial backing",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Aza queen mean?",
            optionA: "Tough unyielding person",
            optionB: "A young girlfriend",
            optionC: "Sends account to admirers",
            optionD: "Money",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Soft life mean?",
            optionA: "Painful romantic breakup",
            optionB: "A rival or enemy",
            optionC: "Total comfort, zero stress",
            optionD: "I disagree",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Hard life mean?",
            optionA: "In heavy quantities",
            optionB: "Shocking upcoming success",
            optionC: "Having zero money",
            optionD: "Enduring daily stress",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Carry first mean?",
            optionA: "Consistent stable pace",
            optionB: "A massive debt",
            optionC: "Scanning your environment",
            optionD: "Excelling in exams",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does F9 mean?",
            optionA: "Money or cash",
            optionB: "To get angry",
            optionC: "Utter total failure",
            optionD: "A married woman",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Expo mean?",
            optionA: "Flaunting wealth publicly",
            optionB: "A close friend",
            optionC: "Leaked exam answers",
            optionD: "Expression of shock",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Sorted mean?",
            optionA: "Bribing for grades",
            optionB: "To hit someone",
            optionC: "A messy complication",
            optionD: "Living on handouts",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Carryover mean?",
            optionA: "Failing and retaking",
            optionB: "Joint street collusion",
            optionC: "Hearing juicy gossip",
            optionD: "Flashy mismatched colors",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Chop book mean?",
            optionA: "Expression of shock",
            optionB: "Dedicated academic bookworm",
            optionC: "Foreign secondhand goods",
            optionD: "Complicated romantic mess",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does ITK mean?",
            optionA: "Brand new currency",
            optionB: "Always-answers pretender",
            optionC: "Discussion officially closed",
            optionD: "Having zero money",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Ajuwaya mean?",
            optionA: "Settling outstanding debt",
            optionB: "Youth Corps members",
            optionC: "Goodbye till later",
            optionD: "A generic peer",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Bookie mean?",
            optionA: "This guy",
            optionB: "Smoky suya corner",
            optionC: "Scanning your environment",
            optionD: "Always in library",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Crash mean?",
            optionA: "Crash from exhaustion",
            optionB: "Utter total failure",
            optionC: "Currently broke people",
            optionD: "Bank account number",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Tush mean?",
            optionA: "Refined polished person",
            optionB: "Major deal success",
            optionC: "Sweet tender romance",
            optionD: "Multiple electronic transfers",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Mass failure mean?",
            optionA: "Sturdy everyday items",
            optionB: "Mass exam failure",
            optionC: "Foreign scam target",
            optionD: "Useless",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Gown code mean?",
            optionA: "Wild youth nightlife",
            optionB: "Immense financial backing",
            optionC: "Strict dress code",
            optionD: "Become blissfully drunk",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Bunk mean?",
            optionA: "Squeeze into space",
            optionB: "Thrifting for clothes",
            optionC: "Great marriage material",
            optionD: "Sneak out secretly",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Fag mean?",
            optionA: "Bribing for grades",
            optionB: "Thrifted designer clothing",
            optionC: "Senior who bullies",
            optionD: "Brand new",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does High school sweetie mean?",
            optionA: "An unexpected calamity",
            optionB: "Foreign secondhand goods",
            optionC: "School childhood lover",
            optionD: "Online trolling chaos",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Vibe check mean?",
            optionA: "Transactional money relationship",
            optionB: "Just coasting along",
            optionC: "To be aggressive",
            optionD: "Reading someone's energy",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Energy mean?",
            optionA: "Look completely unbothered",
            optionB: "Vibe someone brings",
            optionC: "Intense frustration exclamation",
            optionD: "An exaggerated lie",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does No cap zone mean?",
            optionA: "Foreign secondhand goods",
            optionB: "Driving against traffic",
            optionC: "Secondary income stream",
            optionD: "Absolute honesty space",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does On a code mean?",
            optionA: "Have smaller change",
            optionB: "Secret dating arrangement",
            optionC: "Disappoint someone",
            optionD: "The United Kingdom",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Shine your eye mean?",
            optionA: "A terrible personality",
            optionB: "Expensive neighbourhood living",
            optionC: "Dangling skin piece",
            optionD: "Stay vigilant always",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Keep it 100 mean?",
            optionA: "An elevated bridge",
            optionB: "Absolute honesty space",
            optionC: "Utter total failure",
            optionD: "Brutally raw honesty",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Las las mean?",
            optionA: "Gone completely wild",
            optionB: "To have sex",
            optionC: "A white person",
            optionD: "At the end",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does We dey alright mean?",
            optionA: "Lavish spender person",
            optionB: "Dangling skin piece",
            optionC: "Deep resilience statement",
            optionD: "Mass exam failure",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does E go be mean?",
            optionA: "Hopeful sign-off phrase",
            optionB: "Paying under pressure",
            optionC: "Something great happens",
            optionD: "Extreme hardship level",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Idanism mean?",
            optionA: "A very jealous person",
            optionB: "Please",
            optionC: "Youth Corps members",
            optionD: "Idan boss philosophy",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Aura points mean?",
            optionA: "Driving against traffic",
            optionB: "Rugged and unyielding",
            optionC: "Coolness measuring metric",
            optionD: "Respectful street salute",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does I stand with mean?",
            optionA: "Pledging trend loyalty",
            optionB: "No nonsense time",
            optionC: "Untrustworthy behavior",
            optionD: "Final destination always",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Dey play focus mean?",
            optionA: "No problem",
            optionB: "Live excessively large",
            optionC: "Stay focused reminder",
            optionD: "Peaceful goodnight sign-off",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Set awon mean?",
            optionA: "Goodbye till later",
            optionB: "Dedicated academic bookworm",
            optionC: "Specific people category",
            optionD: "Permanently stuck situation",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does You do this one mean?",
            optionA: "Speaking broken English",
            optionB: "Anti-adultery spell",
            optionC: "Transport via buses",
            optionD: "High commendation phrase",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does E reach mean?",
            optionA: "Suffer brutal heartbreak",
            optionB: "Is this enough?",
            optionC: "A gullible person",
            optionD: "Thrifting for clothes",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Ova mean?",
            optionA: "Standing firmly unshaken",
            optionB: "Hyper street guy",
            optionC: "Matter completely done",
            optionD: "Pay on delivery",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Na standard mean?",
            optionA: "Premium quality standard",
            optionB: "To have casual sex",
            optionC: "Effortless personal style",
            optionD: "It is fine",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Buss mean?",
            optionA: "Only works when watched",
            optionB: "Hitting perfectly right",
            optionC: "With lightning speed",
            optionD: "Showing off achievements",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gbe body mean?",
            optionA: "Plea for help",
            optionB: "Dance floor command",
            optionC: "Noodles and spaghetti",
            optionD: "Expensive clothes",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Who go help mean?",
            optionA: "A true helper",
            optionB: "Customized luxury jewelry",
            optionC: "To have sex",
            optionD: "Spiritually enhanced fraud",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Wahala no dey finish mean?",
            optionA: "Make rivals uncomfortable",
            optionB: "Endless life problems",
            optionC: "Flashing luxury falsely",
            optionD: "Thrifting for clothes",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does No be juju? mean?",
            optionA: "Praising sharp intelligence",
            optionB: "Scenario has occurred",
            optionC: "Dark magic arranged",
            optionD: "Cheap local gin",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Ear dey tinz mean?",
            optionA: "Coolness measuring metric",
            optionB: "Hearing juicy gossip",
            optionC: "A painful knock",
            optionD: "Tea and egg vendor",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does No shishi mean?",
            optionA: "Secret outside lover",
            optionB: "Egg and noodle mix",
            optionC: "Commercial sex worker",
            optionD: "Having zero money",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does O ya zuzu mean?",
            optionA: "Left haters speechless",
            optionB: "Hopeful sign-off phrase",
            optionC: "Regulated bus transport",
            optionD: "Calm then chaos",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Loud am mean?",
            optionA: "Broadcasting secrets publicly",
            optionB: "Were you sent?",
            optionC: "A Lagos slang",
            optionD: "Commercial sex worker",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Keep change mean?",
            optionA: "Faking official status",
            optionB: "To give gifts",
            optionC: "A gullible person",
            optionD: "Keep opinions private",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Mapami mean?",
            optionA: "Ridiculous things for fame",
            optionB: "To be aggressive",
            optionC: "Pregnant outside wedlock",
            optionD: "Exclaiming someone's beauty",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Vibe check passed mean?",
            optionA: "A gullible person",
            optionB: "Matching cool energy",
            optionC: "Conflict has begun",
            optionD: "To permanently emigrate",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Opor funja mean?",
            optionA: "Youth Corps members",
            optionB: "Speaking broken English",
            optionC: "Street how-are-you greeting",
            optionD: "Ridiculously overflowing wealth",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Chop premium mean?",
            optionA: "Most luxurious lifestyle",
            optionB: "Foreign secondhand goods",
            optionC: "Multiple electronic transfers",
            optionD: "Scanning your environment",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does No formatting mean?",
            optionA: "An expert artisan",
            optionB: "Physical cash",
            optionC: "Raw and unfiltered",
            optionD: "An unexpected calamity",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does E dey flow mean?",
            optionA: "Steady cash inflow",
            optionB: "Keep investments secure",
            optionC: "Extreme wealth display",
            optionD: "Stay focused reminder",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Kala mean?",
            optionA: "Mean and stingy",
            optionB: "Cheap local gin",
            optionC: "Let topic slide",
            optionD: "United States",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Maju mean?",
            optionA: "Total complete failure",
            optionB: "A rugged person",
            optionC: "Become hyper-aggressive",
            optionD: "The United Kingdom",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gbajumo mean?",
            optionA: "Popular social figure",
            optionB: "To completely forget",
            optionC: "To eat",
            optionD: "Hiring vehicle privately",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Aro mean?",
            optionA: "Strict dress code",
            optionB: "A gullible person",
            optionC: "Reckless street behavior",
            optionD: "Scanning your environment",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Oshisko mean?",
            optionA: "Undocumented transaction deal",
            optionB: "Total complete failure",
            optionC: "High commendation phrase",
            optionD: "Right?",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does E don happen mean?",
            optionA: "Elite standing person",
            optionB: "Wasting valuable time",
            optionC: "Conflict has begun",
            optionD: "Doing it secretly",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Shun mean?",
            optionA: "Squeeze into space",
            optionB: "To frown",
            optionC: "Tell them off",
            optionD: "Secret dating arrangement",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Drop weapon mean?",
            optionA: "Leaked exam answers",
            optionB: "Party and dance out",
            optionC: "Switch to anger",
            optionD: "Stop heavy English",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Gbana mean?",
            optionA: "Marrying up class",
            optionB: "Premium street marijuana",
            optionC: "Brand new currency",
            optionD: "Exclaiming over blessings",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Skuchies mean?",
            optionA: "Exactly!",
            optionB: "Hailing cheap private ride",
            optionC: "Potent street cocaine",
            optionD: "Your personal choice",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Monkey tail mean?",
            optionA: "Marijuana-mixed drink",
            optionB: "Commercial motorcycle",
            optionC: "Internet fraudsters",
            optionD: "Serious family gathering",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Ogogoro mean?",
            optionA: "Wasting valuable time",
            optionB: "Local distilled palm gin",
            optionC: "Settling dispute with cash",
            optionD: "Emergency savings buffer",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Felele mean?",
            optionA: "Very flimsy material",
            optionB: "Absolute honesty space",
            optionC: "Sells imported cars",
            optionD: "Strict dress code",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Opa 6 mean?",
            optionA: "Reckless street behavior",
            optionB: "Something great happens",
            optionC: "Lethal traditional beating",
            optionD: "Disappoint someone",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Paraga mean?",
            optionA: "Popular social figure",
            optionB: "Cheap local gin",
            optionC: "An extra portion",
            optionD: "Have significant money",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Agbo mean?",
            optionA: "Final destination always",
            optionB: "An exaggerated lie",
            optionC: "Traditional herbal medicine",
            optionD: "Cow tripe delicacy",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Kondo mean?",
            optionA: "Heavy beating baton",
            optionB: "Overpriced Lekki lifestyle",
            optionC: "A stylish woman",
            optionD: "Money or cash",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Ewo! mean?",
            optionA: "A married woman",
            optionB: "Spiced beef jerky",
            optionC: "A slim woman",
            optionD: "Profound shock exclamation",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Oti o! mean?",
            optionA: "Bustling transit junctions",
            optionB: "Absolute flat refusal",
            optionC: "Physically intercept someone",
            optionD: "Steady cash inflow",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Kai! mean?",
            optionA: "Stable responsible man",
            optionB: "Make rivals uncomfortable",
            optionC: "Intense frustration exclamation",
            optionD: "Painful romantic breakup",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Bawo? mean?",
            optionA: "Conflict has begun",
            optionB: "Street how-are-you greeting",
            optionC: "At the end",
            optionD: "Brutally raw honesty",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Shoro niyen? mean?",
            optionA: "Wealthy free spender",
            optionB: "Utter total failure",
            optionC: "Your personal choice",
            optionD: "Does that make sense",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Otua mean?",
            optionA: "Yellow commercial bus",
            optionB: "Absolute agreement exclamation",
            optionC: "Living on handouts",
            optionD: "A vintage dance",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Gbeborun mean?",
            optionA: "Nosy rumor carrier",
            optionB: "Consistent stable pace",
            optionC: "Your personal choice",
            optionD: "Trusted account owner",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Olosho pro max mean?",
            optionA: "Generic leather footwear",
            optionB: "Elite digital escort",
            optionC: "Don't care at all",
            optionD: "An extramarital affair",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Sticker mean?",
            optionA: "Burning passionate intensity",
            optionB: "To hit someone",
            optionC: "Trouble comes easily",
            optionD: "Overly clingy partner",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Urgent 2k lifestyle mean?",
            optionA: "Lethal traditional beating",
            optionB: "Respectful street salute",
            optionC: "A terrible personality",
            optionD: "Living on handouts",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Side piece mean?",
            optionA: "Trouble",
            optionB: "Secret outside lover",
            optionC: "To be aggressive",
            optionD: "To walk around",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Main chick mean?",
            optionA: "A gullible person",
            optionB: "Negative boring energy",
            optionC: "Absolute solidarity expression",
            optionD: "Official primary partner",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Wife material mean?",
            optionA: "Great marriage material",
            optionB: "Strange things happening",
            optionC: "To leave",
            optionD: "Local canteen vendor",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Husband material mean?",
            optionA: "Stable responsible man",
            optionB: "Untrustworthy behavior",
            optionC: "A plump person",
            optionD: "To break down",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Marry up mean?",
            optionA: "Wealthy influential pastor",
            optionB: "Become blissfully drunk",
            optionC: "Untrustworthy behavior",
            optionD: "Marrying up class",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Premium tears mean?",
            optionA: "Become hyper-aggressive",
            optionB: "Deep emotional sorrow",
            optionC: "Cheap local gin",
            optionD: "Traditional uniform outfits",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Love nwantinti mean?",
            optionA: "Oversized and untidy",
            optionB: "A very jealous person",
            optionC: "Discussion officially closed",
            optionD: "Sweet tender romance",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gum body mean?",
            optionA: "A grammatical error",
            optionB: "Major deal success",
            optionC: "Clinging to someone",
            optionD: "Become blissfully drunk",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Odafe mean?",
            optionA: "Wealthy free spender",
            optionB: "To permanently emigrate",
            optionC: "To deliberately ignore",
            optionD: "Money or cash",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Na person code mean?",
            optionA: "Glamorous uniform clique",
            optionB: "Dance floor command",
            optionC: "Great marriage material",
            optionD: "Everyone has secrets",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Oga at top mean?",
            optionA: "Utter total failure",
            optionB: "An elevated bridge",
            optionC: "Wild life realities",
            optionD: "Top authority figure",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Seniority mean?",
            optionA: "Pulling seniority rank",
            optionB: "Trend-aware person",
            optionC: "Oversized and untidy",
            optionD: "Complicated romantic mess",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Aso ebi girls mean?",
            optionA: "Don't care at all",
            optionB: "Have smaller change",
            optionC: "Local kiosk operators",
            optionD: "Glamorous uniform clique",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Mummy GO mean?",
            optionA: "Get out now",
            optionB: "The United Kingdom",
            optionC: "Flaunting wealth publicly",
            optionD: "Strict religious woman",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Daddy GO mean?",
            optionA: "Motorized tricycle transport",
            optionB: "Wealthy influential pastor",
            optionC: "A true helper",
            optionD: "Total complete failure",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Sapa shield mean?",
            optionA: "Driving against traffic",
            optionB: "Vibe someone brings",
            optionC: "Emergency savings buffer",
            optionD: "How's the vibe?",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does No testing mean?",
            optionA: "Sweet tender romance",
            optionB: "Warning to behave",
            optionC: "Elite wealth confidence",
            optionD: "Ridiculous things for fame",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Collect face mean?",
            optionA: "Look completely unbothered",
            optionB: "Fake wealth impression",
            optionC: "Strategic haggling spot",
            optionD: "Who cares anyway?",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Eye service mean?",
            optionA: "Ridiculous things for fame",
            optionB: "Only works when watched",
            optionC: "Physical cash",
            optionD: "Become hyper-aggressive",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Double portion mean?",
            optionA: "Top authority figure",
            optionB: "Complete structural ruin",
            optionC: "No nonsense time",
            optionD: "Extra large blessing",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Family meeting mean?",
            optionA: "Bank account number",
            optionB: "Scanning your environment",
            optionC: "Serious family gathering",
            optionD: "Fully capable person",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does God when? mean?",
            optionA: "Street how-are-you greeting",
            optionB: "Exposing someone's trouble",
            optionC: "Exclaiming over blessings",
            optionD: "Potent street cocaine",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does E go shock you mean?",
            optionA: "Dump partner unexpectedly",
            optionB: "Flashing luxury falsely",
            optionC: "Shocking upcoming success",
            optionD: "Wealthy free spender",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Aboki mean?",
            optionA: "Local kiosk operators",
            optionB: "Elite wealth confidence",
            optionC: "An exaggerated lie",
            optionD: "To frown",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Suya spot mean?",
            optionA: "Praising sharp intelligence",
            optionB: "Pay on delivery",
            optionC: "Smoky suya corner",
            optionD: "Speaking broken English",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Mai Shai mean?",
            optionA: "Tea and egg vendor",
            optionB: "Isn't it?",
            optionC: "Failing and retaking",
            optionD: "Invisible success proof",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Meshai mean?",
            optionA: "A close friend",
            optionB: "A lavish party",
            optionC: "Egg and noodle mix",
            optionD: "A vintage dance",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Gworo mean?",
            optionA: "Chill and relax",
            optionB: "Calm sensible view",
            optionC: "Kola to stay awake",
            optionD: "Native roasted plantain",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Ugwu mean?",
            optionA: "Term for vegetables",
            optionB: "Great marriage material",
            optionC: "Field dominating guy",
            optionD: "Noodles and spaghetti",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Kpomo mean?",
            optionA: "Cooked cow skin",
            optionB: "Regulated bus transport",
            optionC: "Extreme financial brokenness",
            optionD: "Reckless street behavior",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Shaki mean?",
            optionA: "Cow tripe delicacy",
            optionB: "How's the vibe?",
            optionC: "Currently broke people",
            optionD: "Dressing for clout",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Abacha mean?",
            optionA: "Dried cassava salad",
            optionB: "A reverse slap",
            optionC: "Fake wealth impression",
            optionD: "Joint street collusion",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Nkwobi mean?",
            optionA: "Cow foot dish",
            optionB: "Trouble",
            optionC: "Do not break",
            optionD: "Speaking broken English",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Kilishi mean?",
            optionA: "Street trader raiders",
            optionB: "Spiced beef jerky",
            optionC: "Absolute honesty space",
            optionD: "A sex worker",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Dunlop mean?",
            optionA: "Ridiculous things for fame",
            optionB: "Smoky suya corner",
            optionC: "Generic rubber slippers",
            optionD: "Something great happens",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Bata mean?",
            optionA: "Generic leather footwear",
            optionB: "Exclaiming over blessings",
            optionC: "Splurging on comfort",
            optionD: "United States",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Olosho short-time mean?",
            optionA: "To get angry",
            optionB: "Popular social figure",
            optionC: "Renting room for sex",
            optionD: "Plea for help",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Next tomorrow mean?",
            optionA: "Illegal driver levies",
            optionB: "Sells imported cars",
            optionC: "Extreme financial brokenness",
            optionD: "Day after tomorrow",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Turn-up mean?",
            optionA: "To show off",
            optionB: "Emergency savings buffer",
            optionC: "Shock or amazement",
            optionD: "Party and dance out",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does Dey steady mean?",
            optionA: "Air conditioning unit",
            optionB: "A male companion",
            optionC: "Consistent stable pace",
            optionD: "Flashing luxury falsely",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "easy"
        },
        {
            question: "What does I stand gidigba mean?",
            optionA: "Standing firmly unshaken",
            optionB: "Gone completely wild",
            optionC: "Expensive neighbourhood living",
            optionD: "Share wealth secret",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does No shake mean?",
            optionA: "Feeling physical pain",
            optionB: "A white person",
            optionC: "We move forward",
            optionD: "Everything under control",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does O dabo mean?",
            optionA: "Goodbye till later",
            optionB: "Rich dark complexion",
            optionC: "Untrustworthy behavior",
            optionD: "Absolute flat refusal",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Kachifo mean?",
            optionA: "Peaceful goodnight sign-off",
            optionB: "To completely forget",
            optionC: "A rival or enemy",
            optionD: "To eat",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does Sai an jima mean?",
            optionA: "Raw and unfiltered",
            optionB: "Goodbye see you",
            optionC: "Shock or amazement",
            optionD: "To permanently emigrate",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does We dey together mean?",
            optionA: "Were you sent?",
            optionB: "Absolute solidarity expression",
            optionC: "Sneak out secretly",
            optionD: "Sudden fear feeling",
            correctAnswer: "B",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does No breaking mean?",
            optionA: "Renting room for sex",
            optionB: "Finding comedy in stress",
            optionC: "Alcoholic drinks",
            optionD: "Hustle never collapse",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "hard"
        },
        {
            question: "What does The matter don close mean?",
            optionA: "Discussion officially closed",
            optionB: "Join the vibe",
            optionC: "Elite standing person",
            optionD: "Spending carelessly always",
            correctAnswer: "A",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Slang_419 mean?",
            optionA: "A Lagos slang",
            optionB: "To be street-smart",
            optionC: "To get stuck",
            optionD: "A fraudster",
            correctAnswer: "D",
            category: "lagos_slang",
            difficulty: "medium"
        },
        {
            question: "What does Slang_500 mean?",
            optionA: "Extreme wealth display",
            optionB: "A terrible personality",
            optionC: "A Lagos slang",
            optionD: "Fully ready always",
            correctAnswer: "C",
            category: "lagos_slang",
            difficulty: "medium"
        }
    ];

    // Return a random question from the array
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lagosSlangs };
}
