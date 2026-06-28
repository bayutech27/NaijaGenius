// js/question/nigeriaCulture.js

/**
 * Nigeria Culture Trivia Question Bank
 * Returns a random question from the dataset
 * Each question contains: question, optionA, optionB, optionC, optionD, correctAnswer, category, difficulty
 */
function nigeriaCulture() {
    const questions = [
        {
            question: "What is the official language of Nigeria?",
            optionA: "English",
            optionB: "Hausa",
            optionC: "Igbo",
            optionD: "Yoruba",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which is the largest ethnic group in Northern Nigeria?",
            optionA: "Hausa-Fulani",
            optionB: "Yoruba",
            optionC: "Igbo",
            optionD: "Ijaw",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Ile-Ife is the ancestral home of which ethnic group?",
            optionA: "Yoruba",
            optionB: "Igbo",
            optionC: "Hausa",
            optionD: "Edo",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What is the most popular sport across Nigeria?",
            optionA: "Football",
            optionB: "Boxing",
            optionC: "Tennis",
            optionD: "Rugby",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which fabric is a distinct marker of Nigerian identity?",
            optionA: "Ankara",
            optionB: "Silk",
            optionC: "Wool",
            optionD: "Linen",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What is a popular spicy grilled meat snack in Nigeria?",
            optionA: "Suya",
            optionB: "Kilishi",
            optionC: "Balangu",
            optionD: "Dundu",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "The Argungu Fishing Festival takes place in which state?",
            optionA: "Kebbi",
            optionB: "Kano",
            optionC: "Lagos",
            optionD: "Osun",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "The Nok culture is known for which ancient art form?",
            optionA: "Terracotta",
            optionB: "Bronze",
            optionC: "Gold",
            optionD: "Marble",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the traditional Yoruba king's title?",
            optionA: "Oba",
            optionB: "Emir",
            optionC: "Etsu",
            optionD: "Igwe",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Nigerian movie industry widely known as?",
            optionA: "Nollywood",
            optionB: "Hollywood",
            optionC: "Bollywood",
            optionD: "Tollywood",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which is a staple carbohydrate food in Nigeria?",
            optionA: "Pounded Yam",
            optionB: "Pasta",
            optionC: "Rice",
            optionD: "Bread",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which festival is Africa's biggest street party?",
            optionA: "Calabar Carnival",
            optionB: "Eyo",
            optionC: "Durbar",
            optionD: "Igue",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Who established the Sokoto Caliphate in 1804?",
            optionA: "Uthman dan Fodio",
            optionB: "Queen Amina",
            optionC: "Oba Ewuare",
            optionD: "Kola",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What term describes Nigeria's popular modern music genre?",
            optionA: "Afrobeats",
            optionB: "Jazz",
            optionC: "Reggae",
            optionD: "Blues",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What is a common fermented Nigerian beverage?",
            optionA: "Palm Wine",
            optionB: "Tea",
            optionC: "Coffee",
            optionD: "Milk",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which state hosts the annual Osun-Osogbo Festival?",
            optionA: "Osun",
            optionB: "Lagos",
            optionC: "Kano",
            optionD: "Rivers",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What are the Yoruba twin sculptures called?",
            optionA: "Ibeji",
            optionB: "Ekpe",
            optionC: "Ofo",
            optionD: "Ikenga",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "The \"Baban-riga\" is a traditional robe worn by which group?",
            optionA: "Hausa-Fulani",
            optionB: "Yoruba",
            optionC: "Igbo",
            optionD: "Edo",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which tree is culturally revered in Yorubaland?",
            optionA: "Iroko",
            optionB: "Palm",
            optionC: "Mango",
            optionD: "Banana",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does the Oji (kola nut) ceremony symbolize?",
            optionA: "Hospitality",
            optionB: "War",
            optionC: "Silence",
            optionD: "Anger",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which kingdom is famous for bronze casting?",
            optionA: "Benin",
            optionB: "Oyo",
            optionC: "Sokoto",
            optionD: "Kanem",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the primary ingredient of Egusi soup?",
            optionA: "Melon seeds",
            optionB: "Beans",
            optionC: "Yam",
            optionD: "Cassava",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Where are the historic Kano dye pits located?",
            optionA: "Kano",
            optionB: "Lagos",
            optionC: "Enugu",
            optionD: "Jos",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which culture is known for the \"Ange\" cloth?",
            optionA: "Tiv",
            optionB: "Yoruba",
            optionC: "Hausa",
            optionD: "Edo",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the largest language family in Nigeria?",
            optionA: "Niger-Congo",
            optionB: "Nilo-Saharan",
            optionC: "Afro-Asiatic",
            optionD: "Bantu",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "The Eyo festival is famously celebrated in which city?",
            optionA: "Lagos",
            optionB: "Abuja",
            optionC: "Kano",
            optionD: "Onitsha",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What do the Bini people call their monarch?",
            optionA: "Oba",
            optionB: "Emir",
            optionC: "Ooni",
            optionD: "Igwe",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which state is home to the Sukur cultural landscape?",
            optionA: "Adamawa",
            optionB: "Ogun",
            optionC: "Lagos",
            optionD: "Delta",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What is the traditional Igbo title for a king?",
            optionA: "Igwe",
            optionB: "Oba",
            optionC: "Emir",
            optionD: "Etsu",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What animal features in many Nigerian moral trickster tales?",
            optionA: "Tortoise",
            optionB: "Lion",
            optionC: "Rabbit",
            optionD: "Spider",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which people are historically known as skilled glass makers?",
            optionA: "Nupe",
            optionB: "Yoruba",
            optionC: "Igbo",
            optionD: "Hausa",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What is the Yoruba head-tie for women called?",
            optionA: "Gele",
            optionB: "Agbada",
            optionC: "Iro",
            optionD: "Buba",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which region is the \"Middle Belt\" located?",
            optionA: "Central Nigeria",
            optionB: "North",
            optionC: "South",
            optionD: "West",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the popular fermented cassava meal called?",
            optionA: "Garri",
            optionB: "Yam",
            optionC: "Rice",
            optionD: "Bean",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which city is the spiritual center for the Yoruba?",
            optionA: "Ile-Ife",
            optionB: "Lagos",
            optionC: "Ibadan",
            optionD: "Oyo",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "The \"Gongon\" is a drum associated with which group?",
            optionA: "Hausa",
            optionB: "Yoruba",
            optionC: "Igbo",
            optionD: "Efik",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which is a traditional soup made from baobab leaves?",
            optionA: "Miyan Kuka",
            optionB: "Egusi",
            optionC: "Ofe Onugbu",
            optionD: "Ewedu",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does \"Owanbe\" describe in Nigerian culture?",
            optionA: "Loud party",
            optionB: "Quiet meal",
            optionC: "Fishing trip",
            optionD: "Dance class",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Who is the spiritual leader of Nigerian Muslims?",
            optionA: "Sultan",
            optionB: "Oba",
            optionC: "Igwe",
            optionD: "Etsu",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What do the Ijaw people traditionally rely on?",
            optionA: "Fishing",
            optionB: "Farming",
            optionC: "Mining",
            optionD: "Herding",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "The \"Dambe\" is a traditional sport of which group?",
            optionA: "Hausa",
            optionB: "Yoruba",
            optionC: "Igbo",
            optionD: "Edo",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What is the popular Nigerian movie hub?",
            optionA: "Nollywood",
            optionB: "Bollywood",
            optionC: "Hollywood",
            optionD: "Cinema",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which group uses the red cap for authority?",
            optionA: "Igbo",
            optionB: "Yoruba",
            optionC: "Hausa",
            optionD: "Nupe",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which metal instrument is used to summon meetings?",
            optionA: "Gong",
            optionB: "Drum",
            optionC: "Flute",
            optionD: "Trumpet",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the traditional name for the Yoruba kingdom?",
            optionA: "Oyo Empire",
            optionB: "Benin",
            optionC: "Sokoto",
            optionD: "Kanem",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which state is known for the Argungu festival?",
            optionA: "Kebbi",
            optionB: "Lagos",
            optionC: "Osun",
            optionD: "Kano",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What language was the first reduced to writing?",
            optionA: "Efik",
            optionB: "Igbo",
            optionC: "Yoruba",
            optionD: "Hausa",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which fruit is a \"king\" in Igboland?",
            optionA: "Yam",
            optionB: "Mango",
            optionC: "Banana",
            optionD: "Orange",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What does a \"Town Union\" provide?",
            optionA: "Support",
            optionB: "Tax",
            optionC: "War",
            optionD: "Food",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What term signifies a bride price negotiation?",
            optionA: "Saddaki",
            optionB: "Igba",
            optionC: "Doro",
            optionD: "Gele",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What do Yoruba men wear to show respect?",
            optionA: "Agbada",
            optionB: "Shirt",
            optionC: "Suit",
            optionD: "Vest",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Where is the city of Ile-Ife located?",
            optionA: "Nigeria",
            optionB: "Ghana",
            optionC: "Togo",
            optionD: "Benin",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which state is primarily inhabited by Gbagyi people?",
            optionA: "FCT",
            optionB: "Kano",
            optionC: "Lagos",
            optionD: "Ogun",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Yoruba term for praise poetry?",
            optionA: "Oriki",
            optionB: "Ijala",
            optionC: "Ewi",
            optionD: "Ofo",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which tribe is native to the Jos Plateau?",
            optionA: "Berom",
            optionB: "Igbo",
            optionC: "Hausa",
            optionD: "Efik",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What do Yoruba people call twins?",
            optionA: "Ibeji",
            optionB: "Eyo",
            optionC: "Osun",
            optionD: "Oba",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which food is made from fermented cassava flour?",
            optionA: "Eba",
            optionB: "Rice",
            optionC: "Yam",
            optionD: "Beans",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What title is held by the Edo ruler?",
            optionA: "Oba",
            optionB: "Emir",
            optionC: "Etsu",
            optionD: "Igwe",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does the \"Gelede\" festival honor?",
            optionA: "Mothers",
            optionB: "Fathers",
            optionC: "Youth",
            optionD: "Children",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is a common ingredient in southern soups?",
            optionA: "Palm oil",
            optionB: "Butter",
            optionC: "Milk",
            optionD: "Honey",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Who established the Sokoto Caliphate?",
            optionA: "Dan Fodio",
            optionB: "Queen Amina",
            optionC: "Oba Ewuare",
            optionD: "King Jaja",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which language is common in the Niger Delta?",
            optionA: "Ijaw",
            optionB: "Hausa",
            optionC: "Yoruba",
            optionD: "Igbo",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What are the oldest wood carvings called?",
            optionA: "Ekpu",
            optionB: "Ibeji",
            optionC: "Ikenga",
            optionD: "Ofo",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which group is famous for fishing skills?",
            optionA: "Ijaw",
            optionB: "Hausa",
            optionC: "Yoruba",
            optionD: "Igbo",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is a common Northern Nigerian drink?",
            optionA: "Kunu",
            optionB: "Tea",
            optionC: "Coffee",
            optionD: "Wine",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which ethnic group is in the southeast?",
            optionA: "Igbo",
            optionB: "Hausa",
            optionC: "Yoruba",
            optionD: "Ijaw",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What does the Oji nut symbolize?",
            optionA: "Peace",
            optionB: "War",
            optionC: "Debt",
            optionD: "Trade",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Where are the Kano dye pits found?",
            optionA: "Kano",
            optionB: "Lagos",
            optionC: "Enugu",
            optionD: "Osun",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the traditional Igbo title holder?",
            optionA: "Ozo",
            optionB: "Oba",
            optionC: "Emir",
            optionD: "Etsu",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which group uses the \"Ange\" cloth?",
            optionA: "Tiv",
            optionB: "Yoruba",
            optionC: "Igbo",
            optionD: "Nupe",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the largest African film industry?",
            optionA: "Nollywood",
            optionB: "Hollywood",
            optionC: "Bollywood",
            optionD: "Tollywood",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which festival happens annually in Osogbo?",
            optionA: "Osun-Osogbo",
            optionB: "Eyo",
            optionC: "Durbar",
            optionD: "Igue",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which culture is known for bronze plaques?",
            optionA: "Bini",
            optionB: "Hausa",
            optionC: "Tiv",
            optionD: "Ijaw",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is a typical Nigerian staple food?",
            optionA: "Pounded Yam",
            optionB: "Pasta",
            optionC: "Pizza",
            optionD: "Bread",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What do the Yoruba call a king?",
            optionA: "Oba",
            optionB: "Emir",
            optionC: "Etsu",
            optionD: "Igwe",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which state hosts the Argungu festival?",
            optionA: "Kebbi",
            optionB: "Lagos",
            optionC: "Osun",
            optionD: "Kano",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What material is used for Nok art?",
            optionA: "Terracotta",
            optionB: "Bronze",
            optionC: "Gold",
            optionD: "Iron",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does \"Owanbe\" imply in Nigeria?",
            optionA: "Party",
            optionB: "Fight",
            optionC: "Work",
            optionD: "Study",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which language is a lingua franca?",
            optionA: "Pidgin",
            optionB: "English",
            optionC: "Hausa",
            optionD: "Igbo",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What instrument is the \"talking drum\"?",
            optionA: "Dundun",
            optionB: "Flute",
            optionC: "Gong",
            optionD: "Bell",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Who are the people of Bida?",
            optionA: "Nupe",
            optionB: "Igbo",
            optionC: "Hausa",
            optionD: "Yoruba",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which group performs the Durbar festival?",
            optionA: "Hausa",
            optionB: "Yoruba",
            optionC: "Igbo",
            optionD: "Ijaw",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What animal is a Yoruba trickster?",
            optionA: "Tortoise",
            optionB: "Lion",
            optionC: "Tiger",
            optionD: "Spider",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which region is culturally diverse?",
            optionA: "Middle Belt",
            optionB: "North",
            optionC: "South",
            optionD: "West",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Edo language branch?",
            optionA: "Edoid",
            optionB: "Igbo",
            optionC: "Yoruba",
            optionD: "Hausa",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What is the traditional garment called?",
            optionA: "Agbada",
            optionB: "T-shirt",
            optionC: "Jeans",
            optionD: "Jacket",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which state is home to Sukur?",
            optionA: "Adamawa",
            optionB: "Ogun",
            optionC: "Lagos",
            optionD: "Delta",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What do Ijaw people build on?",
            optionA: "Stilts",
            optionB: "Rocks",
            optionC: "Sand",
            optionD: "Clay",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which religion historically influenced the North?",
            optionA: "Islam",
            optionB: "Christianity",
            optionC: "Buddhism",
            optionD: "Hinduism",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Who is the Sultan of Sokoto?",
            optionA: "Leader",
            optionB: "King",
            optionC: "Chief",
            optionD: "Governor",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What is a common meat snack?",
            optionA: "Suya",
            optionB: "Pizza",
            optionC: "Cake",
            optionD: "Bread",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What signifies a successful Igbo title?",
            optionA: "Ozo",
            optionB: "Oba",
            optionC: "Emir",
            optionD: "Etsu",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which dance is popular in Nigeria?",
            optionA: "Afrobeats",
            optionB: "Polka",
            optionC: "Waltz",
            optionD: "Salsa",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What is the national capital?",
            optionA: "Abuja",
            optionB: "Lagos",
            optionC: "Kano",
            optionD: "Enugu",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which tree provides shade and wine?",
            optionA: "Palm",
            optionB: "Mango",
            optionC: "Apple",
            optionD: "Pear",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the primary color of Obatala?",
            optionA: "White",
            optionB: "Red",
            optionC: "Blue",
            optionD: "Black",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which region is the forest zone?",
            optionA: "South",
            optionB: "North",
            optionC: "East",
            optionD: "West",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What represents unity in Nigeria?",
            optionA: "Flag",
            optionB: "Money",
            optionC: "House",
            optionD: "Car",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What do the Gbagyi carry loads on?",
            optionA: "Shoulders",
            optionB: "Head",
            optionC: "Hands",
            optionD: "Back",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Who preserves history via songs?",
            optionA: "Griots",
            optionB: "Teachers",
            optionC: "Soldiers",
            optionD: "Doctors",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which tribe performs the Guérewol dance?",
            optionA: "Wodaabe",
            optionB: "Yoruba",
            optionC: "Igbo",
            optionD: "Hausa",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What title does the Owo monarch hold?",
            optionA: "Olowo",
            optionB: "Oba",
            optionC: "Emir",
            optionD: "Etsu",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the primary crop for Igbos?",
            optionA: "Yam",
            optionB: "Rice",
            optionC: "Corn",
            optionD: "Wheat",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Which state are the Bura people from?",
            optionA: "Borno",
            optionB: "Lagos",
            optionC: "Oyo",
            optionD: "Kano",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Yoruba divination tray?",
            optionA: "Opon Ifa",
            optionB: "Gele",
            optionC: "Iro",
            optionD: "Buba",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What do Igbos call the extended family?",
            optionA: "Ikwu",
            optionB: "Ozo",
            optionC: "Age",
            optionD: "Title",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Hausa body-guard role?",
            optionA: "Zagi",
            optionB: "King",
            optionC: "Chief",
            optionD: "Servant",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What do Nupe people call rulers?",
            optionA: "Etsu",
            optionB: "Oba",
            optionC: "Emir",
            optionD: "Igwe",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What did traditional Tivs practice?",
            optionA: "Exchange",
            optionB: "Cash",
            optionC: "Gift",
            optionD: "Barter",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What is the leopard society called?",
            optionA: "Ekpe",
            optionB: "Ozo",
            optionC: "Age",
            optionD: "Title",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which tree is spirit-inhabited in Yorubaland?",
            optionA: "Iroko",
            optionB: "Palm",
            optionC: "Mango",
            optionD: "Banana",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Umuahia soup called?",
            optionA: "Ofe Achara",
            optionB: "Egusi",
            optionC: "Oha",
            optionD: "Edikang",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does \"Kowa\" mean in Hausa?",
            optionA: "Everyone",
            optionB: "None",
            optionC: "Some",
            optionD: "Few",
            correctAnswer: "A",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What are the Yoruba twin dolls?",
            optionA: "Ere Ibeji",
            optionB: "Gele",
            optionC: "Ofo",
            optionD: "Eyo",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What is the famous Kano fabric?",
            optionA: "Shadda",
            optionB: "Silk",
            optionC: "Linen",
            optionD: "Cotton",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which kingdom had ivory art?",
            optionA: "Benin",
            optionB: "Oyo",
            optionC: "Sokoto",
            optionD: "Kanem",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Uburu salt method?",
            optionA: "Evaporation",
            optionB: "Burning",
            optionC: "Boiling",
            optionD: "Mining",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which deity is creator in Yoruba?",
            optionA: "Obatala",
            optionB: "Ogun",
            optionC: "Osun",
            optionD: "Shango",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What do age-grades focus on now?",
            optionA: "Development",
            optionB: "War",
            optionC: "Tax",
            optionD: "Trade",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Kano dye pit fabric?",
            optionA: "Adire",
            optionB: "Silk",
            optionC: "Wool",
            optionD: "Nylon",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does Bida glass reuse?",
            optionA: "Bottles",
            optionB: "Clay",
            optionC: "Sand",
            optionD: "Wood",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What is Ibadan's famous craft market?",
            optionA: "Oje",
            optionB: "Kano",
            optionC: "Onitsha",
            optionD: "Jos",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What law governs Ijaw fishing?",
            optionA: "Water",
            optionB: "Land",
            optionC: "Tree",
            optionD: "Soil",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What do praise singers memorize?",
            optionA: "Genealogy",
            optionB: "Science",
            optionC: "Math",
            optionD: "Art",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Which dance is high energy?",
            optionA: "Gbande",
            optionB: "Waltz",
            optionC: "Polka",
            optionD: "Salsa",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What do Mothers honor in Gelede?",
            optionA: "Women",
            optionB: "Men",
            optionC: "Dogs",
            optionD: "Cats",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Borno hierarchy?",
            optionA: "Sarauta",
            optionB: "Ozo",
            optionC: "Age",
            optionD: "Rank",
            correctAnswer: "B",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What signifies a prosperous life?",
            optionA: "Honey",
            optionB: "Salt",
            optionC: "Pepper",
            optionD: "Water",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the Dùndún drum?",
            optionA: "Talking",
            optionB: "Singing",
            optionC: "Silent",
            optionD: "Small",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What is the initiation requirement?",
            optionA: "Wealth",
            optionB: "Luck",
            optionC: "Age",
            optionD: "Time",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does water serve for visitors?",
            optionA: "Friendship",
            optionB: "Debt",
            optionC: "War",
            optionD: "Anger",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does Ijala teach hunters?",
            optionA: "Ethics",
            optionB: "War",
            optionC: "Math",
            optionD: "Science",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What links Middle Belt cultures?",
            optionA: "Trade",
            optionB: "War",
            optionC: "Tax",
            optionD: "Food",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What did guards protect in Benin?",
            optionA: "Walls",
            optionB: "Gates",
            optionC: "Food",
            optionD: "Trees",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Who owns Mmanwu masquerades?",
            optionA: "Community",
            optionB: "King",
            optionC: "Chief",
            optionD: "Family",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is Shea butter for?",
            optionA: "Skincare",
            optionB: "Food",
            optionC: "Fuel",
            optionD: "Glue",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does a tree not make?",
            optionA: "Forest",
            optionB: "House",
            optionC: "Car",
            optionD: "Road",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Where do traders spend time?",
            optionA: "Market",
            optionB: "Home",
            optionC: "School",
            optionD: "Park",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "Who judges civil Igbo disputes?",
            optionA: "Elders",
            optionB: "King",
            optionC: "Chief",
            optionD: "Soldier",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What are Aso-Oke looms?",
            optionA: "Narrow",
            optionB: "Wide",
            optionC: "Flat",
            optionD: "Round",
            correctAnswer: "C",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "Which Kunu treats digestion?",
            optionA: "Medicinal",
            optionB: "Sweet",
            optionC: "Sour",
            optionD: "Cold",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What does braiding indicate in rural?",
            optionA: "Origin",
            optionB: "Age",
            optionC: "Wealth",
            optionD: "Job",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "hard"
        },
        {
            question: "What preserves tradition for youth?",
            optionA: "Digital",
            optionB: "Paper",
            optionC: "Stone",
            optionD: "Wood",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What must rulers approve in health?",
            optionA: "Vaccine",
            optionB: "House",
            optionC: "Food",
            optionD: "Trade",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What happens at home for burial?",
            optionA: "Homecoming",
            optionB: "Travel",
            optionC: "Study",
            optionD: "Trade",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What are Delta houses built on?",
            optionA: "Stilts",
            optionB: "Rocks",
            optionC: "Sand",
            optionD: "Clay",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "Who fixes broken bones?",
            optionA: "Bone-setter",
            optionB: "Doctor",
            optionC: "Nurse",
            optionD: "King",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What is the national motto?",
            optionA: "Unity",
            optionB: "Wealth",
            optionC: "Peace",
            optionD: "Power",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        },
        {
            question: "What does the future rely on?",
            optionA: "Archiving",
            optionB: "Money",
            optionC: "War",
            optionD: "Trade",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "medium"
        },
        {
            question: "What defines Nigerian culture?",
            optionA: "Resilience",
            optionB: "Money",
            optionC: "Fame",
            optionD: "Luck",
            correctAnswer: "D",
            category: "nigeria_culture",
            difficulty: "easy"
        }
    ];

    // Return a random question from the array
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { nigeriaCulture };
}
