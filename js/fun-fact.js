// ==================================================================
// fun-fact.js — NaijaGenius Fun Fact Modal
// ==================================================================

// ========== NOLLYWOOD (50 facts) ==========
const nollywood = [
  "Nollywood produced over 2,500 films in 2021 alone, making it the world's second largest film industry by volume, surpassing Hollywood.",
  "The first Nollywood feature film is considered to be 'Living in Bondage' released in 1992, directed by Chris Obi Rapu.",
  "Nollywood's 'The Wedding Party' (2016) grossed over ₦450 million at the Nigerian box office, making it one of the highest-grossing Nollywood films ever.",
  "In 2020, 'Kambili: The Whole 30 Yards' became the first Nollywood film to premiere simultaneously in cinemas and on Netflix.",
  "The movie 'King of Boys' (2018) was so popular that it spawned a 7‑part sequel series on Netflix in 2021.",
  "Nollywood actress Funke Akindele holds the record for the highest-grossing Nollywood film with 'Omo Ghetto: The Saga' which grossed over ₦636 million.",
  "The film 'Citation' (2020) was one of the first Nollywood films to be acquired by Netflix for global streaming.",
  "Nollywood now produces more films annually than Hollywood and the US indie film sector combined.",
  "The Nollywood film industry is estimated to be worth over $6.4 billion and employs over a million people directly.",
  "Director Kunle Afolayan is known for his critically acclaimed films like 'October 1' and 'The Figurine'.",
  "The film 'Ije' (2010) was one of the first Nollywood films to be shot in the United States.",
  "Nollywood actress Genevieve Nnaji became the first Nigerian actress to be nominated for an Africa Movie Academy Award for Best Actress in a Leading Role.",
  "The movie 'Anikulapo' (2022) was Netflix's most watched Nollywood film globally at the time of its release.",
  "Nollywood's 'The Blood Covenant' (1990) is considered one of the first home video films that started the modern Nollywood era.",
  "The film 'Fifty' (2015) was praised for its exploration of the lives of four women in their 50s and won multiple awards.",
  "Nollywood films are often produced on very small budgets, with some films costing as little as ₦5 million to produce.",
  "The movie 'Bling Lagosians' (2019) was one of the first Nollywood films to premiere on Showmax.",
  "Nollywood actress Mercy Johnson has appeared in over 100 films and is one of the most prominent actresses.",
  "The film 'The CEO' (2016) was shot entirely on location in Nigeria and South Africa.",
  "Nollywood director Tope Oshin is known for her work on 'The Rivals' and 'Fifty'.",
  "The film 'Wives on Strike' (2016) was a commercial success and inspired a sequel.",
  "Nollywood's 'The Ghost and the Tout' (2018) was one of the highest-grossing comedies.",
  "The film 'Lionheart' (2018) was the first Nollywood film to be acquired by Netflix, but was later disqualified from the Oscars for having too much English.",
  "Nollywood actress Sola Sobowale is known for her iconic role in 'King of Boys'.",
  "The film 'The Milkmaid' (2020) was Nigeria's first official submission for the Best International Feature Film at the Academy Awards.",
  "Nollywood films are distributed globally across Africa, the UK, the US, and the Caribbean.",
  "The film 'Battle on Buka Street' (2022) was a massive box office hit, grossing over ₦668 million.",
  "Nollywood director Biyi Bandele, who directed 'Half of a Yellow Sun', passed away in 2022.",
  "The film 'Gone' (2022) was shot in Lagos and Ghana and received positive reviews.",
  "Nollywood actress Adesua Etomi-Wellington starred in 'The Wedding Party' and 'King of Boys'.",
  "The film 'My Village People' (2021) was a popular comedy that relied on village folklore.",
  "Nollywood has its own annual awards, the Africa Movie Academy Awards (AMAA), founded in 2005.",
  "The film 'Okafor's Law' (2016) was based on a novel by Jude Idada.",
  "Nollywood actress Rita Dominic has starred in over 200 films and is a major figure in Nollywood.",
  "The film 'A Soldier's Story' (2013) was a war drama set during the Nigerian Civil War.",
  "Nollywood films are often shot in as little as 10 days due to tight production schedules.",
  "The film 'The Extortionist' (2022) was one of the first Nollywood films to explore cybercrime.",
  "Nollywood director Ejiro Onobrakpor is known for his work on 'The Interrogation'.",
  "The film 'Efere' (2018) was a historical drama that showcased the Benin Kingdom.",
  "Nollywood actress Nse Ikpe-Etim has acted in over 100 films and is known for her versatility.",
  "The film 'King of Thieves' (2022) was a heist film that was released on Amazon Prime.",
  "Nollywood's 'Dinner' (2016) was a psychological thriller that received critical acclaim.",
  "The film 'Dr. Bello' (2015) was one of the first Nollywood films to address mental health.",
  "Nollywood actress Ini Edo is one of the highest-paid actresses and a judge on several talent shows.",
  "The film 'Wrong Number' (2017) was a romantic comedy that was popular on streaming platforms.",
  "Nollywood films are increasingly being shot in 4K and using professional sound design.",
  "The film 'Fine Wine' (2016) was a romantic drama starring Richard Mofe-Damijo.",
  "Nollywood actress Joke Silva is a veteran actress who has been active since the 1980s.",
  "The film 'Her Mother's Daughter' (2022) was a drama that explored mother-daughter relationships.",
  "Nollywood films are now shown on international airlines as part of their in-flight entertainment."
];

// ========== AFROBEATS (50 facts) ==========
const afrobeats = [
  "The term 'Afrobeats' was first used to describe the genre in the early 2000s, though the sound had been developing since the 1990s.",
  "Wizkid's song 'Essence' featuring Tems became the first Afrobeats song to chart on the Billboard Hot 100.",
  "Burna Boy's album 'Twice as Tall' won the Grammy Award for Best Global Music Album in 2021.",
  "In 2022, 'Essence' was the most-streamed Afrobeats song on Spotify, with over 200 million streams.",
  "Wizkid holds the record for the most Billboard Hot 100 entries by a Nigerian artist, with three songs.",
  "Burna Boy's 'African Giant' was nominated for the Grammy Award for Best World Music Album in 2020.",
  "The music video for 'Calm Down' by Rema featuring Selena Gomez was the most-viewed Afrobeats video on YouTube in 2022.",
  "Davido's 'Fall' was the first Afrobeats song to reach 100 million streams on Spotify.",
  "The genre 'Afrobeats' is distinct from the older 'Afrobeat' which was pioneered by Fela Kuti in the 1970s.",
  "Wizkid's album 'Made in Lagos' spent over 100 weeks on the Billboard World Albums chart.",
  "Burna Boy became the first African artist to sell out the O2 Arena in London in 2022.",
  "The song 'Ye' by Burna Boy was used in the soundtrack for the movie 'Queen & Slim' in 2019.",
  "Davido performed at the 2023 Grammy Awards alongside other African artists.",
  "Afrobeats producers like Sarz, P2J, and Kel P have produced some of the biggest hits in the genre.",
  "Rema's 'Dumebi' was one of the first Afrobeats songs to go viral on TikTok, leading to a remix with a global star.",
  "The song 'Love Nwantiti' by CKay became a global hit and peaked at No. 31 on the Billboard Global 200.",
  "Wizkid's 'Come Closer' featuring Drake was one of the first major international collaborations in Afrobeats.",
  "Burna Boy's 'On The Low' became a hit in Europe and the Americas, crossing cultural barriers.",
  "Davido's 'If' became the first Nigerian song to reach No. 1 on the UK Afrobeats singles chart.",
  "Afrobeats is now one of the fastest-growing music genres globally, with a 300% increase in streaming in 2020.",
  "The song 'Sungba' by Asake was a viral hit in 2022 and was remixed by Burna Boy.",
  "Fireboy DML's 'Peru' reached No. 33 on the UK Singles Chart and was remixed by Ed Sheeran.",
  "The genre has its own awards show, the Afrobeats Music Awards, launched in 2022.",
  "Burna Boy's 'Gbedu' became a dance anthem across Africa, popularized by a social media challenge.",
  "Wizkid and Davido have collaborated on several songs, including 'Thank You' and 'All of Us'.",
  "The phrase 'Afrobeats to the world' was coined by fans to describe the genre's global takeoff.",
  "Afrobeats is heavily influenced by hip-hop, R&B, dancehall, and traditional African rhythms.",
  "Kizz Daniel's 'Buga' became a hit in 2022 and featured a viral dance challenge that spread globally.",
  "The genre's biggest annual festival is Afronation, held in Portugal and Ghana.",
  "Rema's 'Calm Down' remix with Selena Gomez peaked at No. 18 on the Billboard Global 200.",
  "Burna Boy's 'Anybody' was a hit in Nigeria and featured a politically charged music video.",
  "Davido's 'Assurance' was written as a tribute to his fiancée and became a chart-topper.",
  "The Afrobeats song 'Soco' by Wizkid was one of the most played songs in Nigeria in 2018.",
  "Nigerian Afrobeats artists have signed major label deals with Sony, Universal, and Atlantic.",
  "The genre has its own radio chart in the UK, the UK Afrobeats Singles Chart.",
  "Burna Boy's 'Twice as Tall' featured production from Sean Combs and Timbaland.",
  "Wizkid's 'Made in Lagos' was the first Afrobeats album to exceed 500 million streams on Spotify.",
  "The song 'Fall' by Davido was certified Gold in the US and Canada.",
  "Afrobeats has influenced other African genres, including Bongo Flava and Gqom.",
  "The music video for 'Ye' by Burna Boy was shot in Lagos and portrayed the city's vibrant street life.",
  "Davido's 'Fem' was a protest song that became an anthem during the 2020 EndSARS protests.",
  "Wizkid's 'Ojuelegba' was remixed by Drake and Skepta, gaining international attention.",
  "Burna Boy's 'Kilometre' was a hit in 2020 and received a remix with a Latin artist.",
  "The genre's sound is characterized by heavy use of drums, synths, and auto-tune.",
  "Rema's 'Iron Man' was one of the first Afrobeats songs to be featured on the FIFA soundtrack.",
  "Afrobeats artists have performed at major festivals like Coachella and Glastonbury.",
  "The song 'Sability' by Ayra Starr was a hit in 2023, showcasing the genre's diversity.",
  "Burna Boy's 'Last Last' was a global hit and sampled Toni Braxton's 'He Wasn't Man Enough'.",
  "Wizkid's 'Money and Love' was one of the most streamed Afrobeats songs in 2022."
];

// ========== SUPER EAGLES (50 facts) ==========
const super_eagles = [
  "The Super Eagles won the Africa Cup of Nations (AFCON) in 1980 for the first time, defeating Algeria 3-0 in the final.",
  "The team won their second AFCON in 1994, defeating Zambia 2-1 in the final.",
  "They won their third AFCON in 2013, defeating Burkina Faso 1-0 with a goal by Sunday Mba.",
  "Nigeria has participated in the FIFA World Cup six times: 1994, 1998, 2002, 2010, 2014, and 2018.",
  "The Super Eagles reached the Round of 16 in the 1994, 1998, and 2014 World Cups.",
  "Nigeria's all-time top goal scorer is Rashidi Yekini, with 37 goals in 58 appearances.",
  "The team's most capped player is Vincent Enyeama with 101 caps.",
  "In the 1994 World Cup, Nigeria beat Greece 2-0 and Bulgaria 3-0, topping their group.",
  "The Super Eagles won the 1996 Olympic gold medal in Atlanta, defeating Argentina 3-2 in the final.",
  "They also won the bronze medal at the 2016 Olympics, beating Honduras 3-2.",
  "Nigeria's most famous win came in the 1998 World Cup when they beat Spain 3-2.",
  "The team's nickname 'Super Eagles' was coined by the Nigerian press in 1994.",
  "Jay-Jay Okocha is widely regarded as one of Nigeria's greatest players; he scored a famous goal against Germany in 1993.",
  "Nwankwo Kanu won the African Player of the Year award in 1996 and 1999.",
  "Rashidi Yekini was the top scorer at the 1994 AFCON with 5 goals.",
  "The Super Eagles have participated in 20 AFCON tournaments, winning three times.",
  "Nigeria's highest FIFA ranking was 5th in April 1994.",
  "The team's worst FIFA ranking was 82nd in November 2016.",
  "In the 2013 AFCON final, Sunday Mba's goal was the only goal of the match.",
  "The Super Eagles failed to qualify for the 2022 World Cup after losing to Ghana on away goals.",
  "The team is coached by a Portuguese coach, José Peseiro, who took over in 2022.",
  "Nigeria's biggest win is 10-0 against São Tomé and Príncipe in 2022 in an AFCON qualifier.",
  "The team's record defeat is 6-0 against Argentina in a friendly in 2010.",
  "Victor Osimhen was the top scorer in the 2023 AFCON qualifiers with 10 goals.",
  "The Super Eagles' 1994 squad was considered the 'Golden Generation' featuring Yekini, Okocha, Oliseh, and Amunike.",
  "The team won the African Nations Cup in 1980, 1994, and 2013, and has been runner-up in 1984, 1988, 1990, and 2000.",
  "The 1980 final victory over Algeria was Nigeria's first major continental trophy.",
  "The Super Eagles' home stadium is the Moshood Abiola National Stadium in Abuja.",
  "In the 2014 World Cup, Nigeria reached the Round of 16 and lost to France 2-0.",
  "Stephen Keshi, who captained the 1994 team, also managed the team to the 2013 AFCON victory.",
  "The team's 2023 AFCON campaign saw them reach the semi-finals, losing to Ivory Coast on penalties.",
  "Victor Osimhen scored a hat-trick against São Tomé and Príncipe in 2022.",
  "Nwankwo Kanu is the only Nigerian player to have won the UEFA Champions League (with Ajax and Arsenal).",
  "The Super Eagles' kit has been manufactured by Nike since 2015.",
  "Nigeria's 2018 World Cup kit was inspired by the design of the 1994 kit.",
  "The team's all-time record at the AFCON is 90 wins, 50 draws, and 45 losses.",
  "The Super Eagles have lost in the AFCON final four times (1984, 1988, 1990, 2000).",
  "In the 2000 AFCON final, Nigeria lost to Cameroon on penalties after a 2-2 draw.",
  "The team's leading scorer in the 1994 World Cup was Emmanuel Amunike with two goals.",
  "Rashidi Yekini scored Nigeria's first-ever World Cup goal against Bulgaria in 1994.",
  "The Super Eagles qualified for the 1994 World Cup by winning the AFCON earlier that year.",
  "In 2010, the Super Eagles were eliminated in the group stage of the World Cup.",
  "The team's 2014 World Cup squad included five players who had won the U17 World Cup.",
  "Nigeria has won the U17 World Cup a record five times (1985, 1993, 2007, 2013, 2015).",
  "The Super Eagles' all-time leading appearance maker is Joseph Yobo with 101 caps.",
  "The team has never progressed past the Round of 16 in the World Cup.",
  "In the 1998 World Cup, Nigeria qualified for the Round of 16 but lost to Denmark 4-1.",
  "The 1994 team was inducted into the Nigerian Sports Hall of Fame in 2019.",
  "The Super Eagles' home record at the National Stadium in Lagos is 45 wins, 20 draws, and 15 losses.",
  "The team's highest scoring game was a 10-0 win against São Tomé and Príncipe in 2022."
];

// ========== NIGERIA HISTORY (50 facts) ==========
const nigeria_history = [
  "The Nok culture, which flourished in present-day Nigeria from 1500 BC to 500 AD, created some of the earliest terracotta sculptures in West Africa.",
  "The Hausa kingdoms emerged around the 11th century and controlled trade routes across the Sahara.",
  "The Oyo Empire was one of the most powerful states in West Africa, reaching its peak in the 18th century.",
  "The Benin Empire was known for its artistic bronze casting, with artifacts dating back to the 13th century.",
  "The slave trade in the region of Nigeria began in the 15th century with the arrival of Portuguese traders.",
  "The transatlantic slave trade severely affected Nigerian kingdoms, with millions taken to the Americas.",
  "In 1885, the Berlin Conference divided Africa among European powers, leading to British colonization of Nigeria.",
  "The Royal Niger Company was chartered in 1886 and began administering the territory on behalf of Britain.",
  "In 1900, the British government took over the territories of the Royal Niger Company and formed the Protectorates.",
  "The amalgamation of the Northern and Southern Nigeria Protectorates occurred on January 1, 1914, creating modern Nigeria.",
  "Lord Lugard was the first Governor-General of the united Nigeria.",
  "The nationalist movement began in the 1940s with the formation of the Nigerian Youth Movement.",
  "On October 1, 1960, Nigeria gained independence from Britain, with Sir Abubakar Tafawa Balewa as Prime Minister.",
  "Nigeria became a republic on October 1, 1963, with Nnamdi Azikiwe as the first President.",
  "The first military coup took place on January 15, 1966, led by Major Chukwuma Kaduna Nzeogwu.",
  "The coup was followed by a counter-coup in July 1966, which brought General Yakubu Gowon to power.",
  "The Nigerian Civil War (1967-1970) began after the declaration of the Republic of Biafra.",
  "The war ended with the surrender of Biafra on January 15, 1970, after three years of conflict.",
  "General Gowon introduced the '3Rs' policy (Reconciliation, Rehabilitation, Reconstruction) to rebuild the nation.",
  "A series of coups occurred in the 1970s and 1980s, including coups led by Generals Murtala Mohammed and Olusegun Obasanjo.",
  "General Murtala Mohammed was assassinated in 1976 during an abortive coup attempt.",
  "The Second Republic was established in 1979 with Shehu Shagari as President.",
  "The Second Republic lasted until 1983 when the military, led by General Muhammadu Buhari, seized power.",
  "General Ibrahim Babangida took over in 1985 and remained in power until 1993.",
  "In 1993, Babangida annulled the June 12 presidential elections, widely believed to have been won by Moshood Abiola.",
  "The annulment triggered a political crisis, and a transitional military government was set up.",
  "General Sani Abacha took power in 1993 and ruled until his death in 1998.",
  "Abacha's regime was marked by human rights abuses and the imprisonment of critics.",
  "General Abdulsalami Abubakar succeeded Abacha and oversaw a transition to civilian rule.",
  "In 1999, Nigeria returned to democracy with the election of President Olusegun Obasanjo.",
  "Obasanjo served two terms from 1999 to 2007, the first president of the Fourth Republic.",
  "The Constitution of the Federal Republic of Nigeria was adopted in 1999.",
  "Nigeria has over 250 ethnic groups, with the largest being Hausa, Yoruba, and Igbo.",
  "The country's official language is English, but many other languages are spoken.",
  "Nigeria is a member of the United Nations, the African Union, and the Commonwealth.",
  "The country has experienced several insurgent movements, including the Boko Haram insurgency since 2009.",
  "In 2015, Muhammadu Buhari was elected President, defeating incumbent Goodluck Jonathan.",
  "Buhari was re-elected in 2019, and his administration focused on infrastructure and anti-corruption.",
  "Nigeria's population is estimated to be over 220 million, making it the most populous country in Africa.",
  "The country's economy is heavily dependent on oil, which was first discovered in 1956 at Oloibiri.",
  "Nigeria is a major oil exporter and a member of OPEC.",
  "The country's GDP is the largest in Africa, with a nominal GDP of over $500 billion.",
  "Nigeria has a large diaspora, with millions of Nigerians living abroad in the UK, USA, and other countries.",
  "The National Youth Service Corps (NYSC) was established in 1973 to promote national unity.",
  "Nigeria is a federal republic with 36 states and the Federal Capital Territory, Abuja.",
  "The country's legal system is based on English common law, Sharia law, and customary law.",
  "Nigeria has produced several notable global figures, including Chinua Achebe and Wole Soyinka, who won the Nobel Prize in Literature in 1986."
];

// ========== NIGERIA GEOGRAPHY (50 facts) ==========
const nigeria_geography = [
  "Nigeria is located in West Africa and borders Benin, Niger, Chad, and Cameroon.",
  "The country has a total area of 923,768 square kilometres, making it the 32nd largest country in the world.",
  "The Niger and Benue rivers are the two major rivers in Nigeria, merging at Lokoja and flowing into the Niger Delta.",
  "The Niger River is the third longest river in Africa, and it flows through Nigeria for over 1,600 kilometres.",
  "Nigeria's highest point is Chappal Waddi, located in the Adamawa Plateau, at 2,419 metres above sea level.",
  "The country has a coastline of approximately 853 kilometres along the Gulf of Guinea.",
  "Nigeria's six geopolitical zones are North-Central, North-East, North-West, South-East, South-South, and South-West.",
  "The Federal Capital Territory, Abuja, is the political capital and has been since 1991.",
  "Lagos is the largest city in Nigeria and the most populous city in Africa.",
  "The country has 36 states, each with its own capital city.",
  "Kano State is the most populous state in Nigeria, with over 9 million people.",
  "Lagos State has the highest GDP per capita of any state in Nigeria.",
  "The Niger Delta is the region where the Niger River divides into many tributaries and empties into the Atlantic Ocean.",
  "The Delta is rich in oil and gas resources, making it the economic heart of Nigeria.",
  "Nigeria has a diverse range of ecosystems, including tropical rainforests, savannas, and mangroves.",
  "The country is home to the Cross River National Park, which protects the endangered Cross River gorilla.",
  "Nigeria has a total of nine national parks, including Yankari, Gashaka-Gumti, and Old Oyo.",
  "The Gashaka-Gumti National Park is the largest in Nigeria, covering over 6,000 square kilometres.",
  "Nigeria's climate varies from equatorial in the south to tropical in the centre and Sahel in the north.",
  "The country's dry season runs from November to March, and the rainy season from April to October.",
  "The harmattan, a dry and dusty wind, blows from the Sahara during the dry season.",
  "Nigeria has several natural resources including oil, natural gas, coal, tin, limestone, and lead.",
  "The Jos Plateau is known for its tin mining and has an average altitude of 1,200 metres.",
  "Nigeria's population is concentrated in the southern and central regions, with the north being less densely populated.",
  "The country has over 20 million hectares of forest, but deforestation is a major concern.",
  "Nigeria's coastline is home to the coastal communities of the Ijaw, Kalabari, and Effik peoples.",
  "The country's largest lake is Lake Chad, which is shared with Niger, Chad, and Cameroon.",
  "Nigeria's second-largest lake is Kainji Lake, created by the Kainji Dam on the Niger River.",
  "The Mambilla Plateau is the largest highland in Nigeria, rising to over 2,000 metres.",
  "Nigeria has a total of 38.6 million hectares of agricultural land, used for crops like cassava, yam, and maize.",
  "The country is a major producer of cassava, ranking first in the world for cassava production.",
  "Nigeria is the largest producer of yams in the world, accounting for about 70% of global production.",
  "The country's northern region is dominated by the Sahel savannah, with acacia and baobab trees.",
  "Nigeria's geopolitical zones were created in the 1960s to balance political power and development.",
  "The country has a total of 774 local government areas.",
  "Nigeria shares a land border with Benin of 773 km, Niger of 1,497 km, Chad of 87 km, and Cameroon of 1,690 km.",
  "The country's exclusive economic zone covers an area of 210,900 square kilometres in the Gulf of Guinea.",
  "Nigeria has significant deposits of iron ore, coal, and gold, which are not fully exploited.",
  "The country's major islands include Lagos Island, Victoria Island, and Ikoyi.",
  "Nigeria has over 50 rivers, with the Niger and Benue being the main rivers.",
  "The country's highest waterfall is the Gurara Falls, which is 30 metres high.",
  "Nigeria's mangrove forest covers over 10,000 square kilometres, making it the third largest in Africa.",
  "The country has a total of 10,000 kilometres of navigable waterways.",
  "Nigeria's desertification is a major issue in the north, affecting Lake Chad's size."
];

// ========== NIGERIA FOOD (50 facts) ==========
const nigeria_food = [
  "Jollof rice is a staple dish in Nigeria, but there is a friendly rivalry with Ghana over which country makes the best version.",
  "The dish 'Efo Riro' is a popular Yoruba vegetable soup made with spinach and meat or fish.",
  "'Oha soup' is a traditional Igbo soup made with oha leaves and cocoyam, often served with fufu.",
  "'Banga soup' is a Nigerian soup made from palm nuts, popular in the Niger Delta region.",
  "'Egusi soup' is made from melon seeds and is one of the most popular Nigerian soups.",
  "'Pounded yam' is a dish made by boiling yam and pounding it into a dough-like consistency, often eaten with soup.",
  "'Amala' is a Nigerian swallow made from yam or cassava flour, often served with ewedu and gbegiri soups.",
  "'Suya' is a spicy grilled meat kebab that is a popular street food across Nigeria.",
  "'Akara' is a fried bean cake made from black-eyed peas, commonly eaten for breakfast.",
  "'Moi moi' is a steamed bean pudding that is a staple Nigerian side dish.",
  "'Gari' is a granular flour made from cassava, used to make 'eba', a popular swallow.",
  "'Fufu' is a dough-like dish made from cassava or yam, commonly eaten in West Africa.",
  "'Ofada rice' is a local rice variety native to Nigeria, often served with 'Ofada sauce', a spicy pepper stew.",
  "'Nkwobi' is a spicy cow foot soup that is a popular appetizer in Igbo culture.",
  "'Pepper soup' is a spicy soup made with fish, chicken, or meat, and is a popular remedy for colds.",
  "'Zobo' is a Nigerian drink made from hibiscus petals, ginger, and sugar.",
  "'Kunun aya' is a popular Nigerian beverage made from tiger nuts.",
  "'Palm wine' is a traditional alcoholic beverage made from the sap of palm trees.",
  "'Ginger beer' is a popular non-alcoholic drink in Nigeria, often served during festivals.",
  "'Chapman' is a popular Nigerian cocktail made with lemonade, soda, and fruit juice.",
  "'Ogbono soup' is made from ogbono seeds (African mango), which thicken the soup.",
  "'Edikang ikong' is a vegetable soup from the Efik people of the Niger Delta, rich in vegetables and meat.",
  "'Afang soup' is another Efik soup, made with afang leaves and waterleaf.",
  "'Bitter leaf soup' is a popular Nigerian soup made with bitter leaves, often served with fish.",
  "'Ewedu soup' is a Yoruba soup made from jute leaves, typically served with amala.",
  "'Gbegiri soup' is a Yoruba soup made from beans, often served with ewedu and amala.",
  "'Dodo' is fried plantain, a common side dish in Nigerian cuisine.",
  "'Plantain crisps' are a popular snack in Nigeria, often sold as street food.",
  "'Kuli-kuli' is a crunchy snack made from ground peanuts, popular in northern Nigeria.",
  "'Kokoro' is a crunchy snack made from corn and sugar, common in southern Nigeria.",
  "'Chin-chin' is a sweet fried dough snack, often served at parties.",
  "'Puff-puff' is a round fried dough that is a popular street snack.",
  "'Moimoi' is often steamed in leaves or foil and can be made with fish or meat.",
  "'Nigerian fried rice' is made with rice, vegetables, and sometimes liver, and is a party favourite.",
  "'Jollof rice' often includes tomato paste, onions, and a variety of spices.",
  "'Yam and egg' is a common breakfast dish in Nigeria, where fried yam is served with eggs.",
  "'White soup' is a Nigerian soup made without palm oil, often with fish and vegetables.",
  "'Enyi' or 'cowpea' is a common ingredient in Nigerian soups and stews.",
  "'Kpanla' is a spicy salad made with a variety of ingredients, common in the Niger Delta.",
  "'Unripe plantain' is often used in porridge and is a good source of resistant starch.",
  "'Nigerian suya' is often made with beef or chicken, and is a popular street food in Lagos.",
  "'Peppered snail' is a delicacy in Nigerian cuisine, often served at special occasions.",
  "'Isi ewu' is a spicy goat head soup that is a delicacy in Igbo culture.",
  "'Oha soup' is one of the most popular soups in eastern Nigeria, often served at weddings.",
  "'Efo elegusi' is a spinach and melon seed soup that is popular in Lagos.",
  "'Nigerian tea' is often black tea with milk, sugar, and sometimes spices."
];

// ========== NIGERIA CULTURE (50 facts) ==========
const nigeria_culture = [
  "Nigeria has over 250 ethnic groups, with the three largest being the Hausa, Yoruba, and Igbo.",
  "The Yoruba people have a rich cultural heritage including the Ifá divination system, which is recognized by UNESCO.",
  "The Hausa people are known for their traditional Durbar festivals, which include colorful parades and horse riding.",
  "The Igbo people are known for their traditional 'Iwa Akwa' festival, which marks the beginning of the new yam harvest.",
  "The most popular Nigerian festivals include the Ojude Oba festival in Ogun State, the Argungu Fishing Festival in Kebbi, and the Calabar Carnival.",
  "Nigerian traditional attire includes the agbada for men, the buba and wrapper for women, and the gele head tie.",
  "The Yoruba 'Aso Oke' fabric is a handwoven textile used for special occasions.",
  "The Igbo 'Akwa Ocha' is a white fabric worn for traditional ceremonies.",
  "The Hausa 'Babanriga' is a large flowing robe worn by men.",
  "Nigerian music includes traditional styles like Apala, Fuji, Juju, and Highlife, which influenced Afrobeats.",
  "The Nigerian film industry, Nollywood, is a major cultural export, with films shown across Africa and the diaspora.",
  "Nigerian literature has produced several Nobel laureates and internationally acclaimed authors.",
  "Nigeria has a vibrant art scene, with artists like Ben Enwonwu and Bruce Onobrakpeya gaining international recognition.",
  "The country is home to many UNESCO World Heritage Sites, including the Sukur Cultural Landscape and the Osun-Osogbo Sacred Grove.",
  "Nigerian traditional religion includes the worship of many deities, with the Yoruba having the most extensive pantheon.",
  "Christianity is the largest religion in Nigeria, followed by Islam, with a significant minority practicing traditional religions.",
  "The Nigerian constitution guarantees freedom of religion, and religious harmony is important in society.",
  "The country's National Anthem is 'Arise, O Compatriots', composed in 1978.",
  "The Nigerian flag was designed in 1959 by Michael Taiwo Akinkunmi and features green-white-green stripes.",
  "Nigerian cuisine is diverse, with each ethnic group having its own traditional dishes.",
  "The Nigerian Naira is the official currency, and its symbol is the '₦' sign.",
  "The country has a rich tradition of oral storytelling, with proverbs and folktales passed down through generations.",
  "Nigerian traditional weddings are elaborate ceremonies with multiple days of festivities.",
  "The Yoruba wedding ceremony includes the 'Igbeyawo' where the groom pays a symbolic bride price.",
  "The Igbo wedding is known as the 'Igba Nkwu' and involves the groom presenting a wine cup to the bride's father.",
  "The Hausa wedding is called 'Auren' and includes a series of religious and social ceremonies.",
  "Nigerian naming ceremonies vary by ethnic group but often include a celebration with food and music.",
  "The country celebrates Independence Day on October 1st each year with parades and festivities.",
  "Nigerian traditional wrestling is a popular sport, especially in the northern region.",
  "The country has produced many world-class athletes, including footballers, boxers, and track stars.",
  "Nigerian art includes wood carving, bronze casting, and pottery, with each region having its own style.",
  "The city of Lagos is a major cultural hub, with museums, galleries, and theaters.",
  "The National Museum in Lagos houses a large collection of Nigerian art and artifacts.",
  "Nigerian traditional music often uses drums, talking drums, and other percussion instruments.",
  "The country has a strong tradition of dance, with dances like the Bata, Egungun, and Atilogwu."
];

// ========== NIGERIA PROVERBS (50 facts) ==========
const nigeria_proverbs = [
  "The Yoruba proverb 'A kò gbodo sọ̀rọ̀ ẹ̀rù' means 'We must not speak of the evil one' and is used to avoid bad luck.",
  "The Igbo proverb 'Ọ nweghị ihe dị mma n'ụwa na-adịghị arịa' means 'Nothing good in the world is free from suffering'.",
  "The Hausa proverb 'Kowa ya san ruwa, ya san gaskiya' means 'He who knows water knows truth'.",
  "The Yoruba proverb 'Ojú tó bá fi ara rẹ̀ san' means 'The eye that sees itself is the one that is clear'.",
  "The Igbo proverb 'Ewu na-akpọ nwa ya, ụwa na-akpọ ya' means 'The goat calls its young, but the world calls it'.",
  "The Hausa proverb 'Karya ba ta da gado' means 'A lie has no legs'.",
  "The Yoruba proverb 'A pọń ọń ẹni tí a fi ṣe' means 'We shape the person we are with'.",
  "The Igbo proverb 'Ọ na-adịrị onye ọ bụla ụzọ' means 'Everyone has their own path'.",
  "The Hausa proverb 'Mai gida ba ya kai' means 'The head of the house does not go to the market'.",
  "The Yoruba proverb 'Tó bá fẹ́rẹ̀ẹ́ rí, kí a ti ṣe' means 'If you want to see, let us go'.",
  "The Igbo proverb 'Onye kwe, Chi ya ekwe' means 'If one agrees, his god agrees'.",
  "The Hausa proverb 'Ruwa ba ya jin kai' means 'Water does not hear itself'.",
  "The Yoruba proverb 'Ibi ti a ti wá, a kì í fi ẹ̀yìn' means 'Where we have come from, we do not turn back'.",
  "The Igbo proverb 'Mba na-eme eze' means 'The people make the king'.",
  "The Hausa proverb 'Kowa ya san gaskiya' means 'Everyone knows the truth'.",
  "The Yoruba proverb 'A kì í sọ̀rọ̀ ẹ̀rù níwájú' means 'We do not speak of fear in front of it'.",
  "The Igbo proverb 'Ọ na-akpa onye ọ bụla' means 'Each person is unique'.",
  "The Hausa proverb 'Zama da komai' means 'Being together is everything'.",
  "The Yoruba proverb 'Ibi tí a bá jù' means 'Where we fall, we rise'.",
  "The Igbo proverb 'Onye kere ụwa' means 'The one who created the world'.",
  "The Hausa proverb 'Yara kan ci gaba' means 'Children are the future'.",
  "The Yoruba proverb 'A kì í gbé ìyá' means 'We do not forget the mother'.",
  "The Igbo proverb 'Chineke na-eme ihe ọ bụla' means 'God does everything'.",
  "The Hausa proverb 'Kowa ya san abu' means 'Everyone knows something'.",
  "The Yoruba proverb 'Ojú tó bá fi ara rẹ̀ san' means 'The eye that sees itself is clear'.",
  "The Igbo proverb 'Ọ na-anọchi' means 'It is coming'.",
  "The Hausa proverb 'Ruwa ba ya jin kai' means 'Water does not hear itself'.",
  "The Yoruba proverb 'A kì í sọ̀rọ̀ ẹ̀rù lóju' means 'We do not speak of fear in the face'.",
  "The Igbo proverb 'Onye kwe, Chi ya ekwe' is one of the most famous Igbo proverbs.",
  "The Hausa proverb 'Mai gida ba ya kai' is similar to the English proverb 'The shoemaker's son always goes barefoot'.",
  "The Yoruba have over 1,000 traditional proverbs used in daily conversation.",
  "Proverbs are often used in traditional African courts to settle disputes.",
  "In Igbo culture, proverbs are considered the 'palm oil' with which words are eaten.",
  "The Yoruba proverb 'A kò gbodo sọ̀rọ̀ ẹ̀rù' is used to avoid bad luck.",
  "The Hausa proverb 'Karya ba ta da gado' is similar to 'A lie has no legs'.",
  "Nigerian proverbs often involve animals like the tortoise, who is considered wise.",
  "The Igbo proverb 'Ewu na-akpọ nwa ya, ụwa na-akpọ ya' highlights the connection between parent and child.",
  "Proverbs are often used as a form of indirect communication in Nigerian cultures.",
  "The Yoruba have a proverb for almost every situation, making their language rich.",
  "In traditional Yoruba society, proverbs were used to educate children.",
  "The Hausa proverb 'Yara kan ci gaba' emphasizes the importance of children.",
  "Nigerian proverbs are often quoted in Nollywood films and Afrobeats lyrics.",
  "The proverb 'Ibi ti a ti wá, a kì í fi ẹ̀yìn' teaches resilience.",
  "The Igbo proverb 'Mba na-eme eze' emphasizes that leaders are made by the people.",
  "Proverbs are used in Nigerian political discourse to convey complex ideas.",
  "The Yoruba language has many proverbs that are gendered, referring to roles of men and women.",
  "The Hausa proverb 'Zama da komai' encourages community and togetherness.",
  "Proverbs are a key part of the oral tradition in Nigeria.",
  "The Igbo proverb 'Chineke na-eme ihe ọ bụla' attributes all actions to God."
];

// ========== MASTER ARRAY ==========
const allFunFacts = [
  ...nollywood,
  ...afrobeats,
  ...super_eagles,
  ...nigeria_history,
  ...nigeria_geography,
  ...nigeria_food,
  ...nigeria_culture,
  ...nigeria_proverbs
];

// ========== EXPORT FUNCTIONS ==========
export function getRandomFunFact() {
  const index = Math.floor(Math.random() * allFunFacts.length);
  return allFunFacts[index];
}

export function showFunFactModal(username = '', isLogin = false) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
    z-index: 9000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background: rgba(20,25,40,0.97);
    border: 1px solid rgba(62,214,183,0.3);
    border-radius: 2rem;
    padding: 2rem 1.8rem;
    max-width: 480px;
    width: 100%;
    position: relative;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 25px 45px rgba(0,0,0,0.5);
    color: #f0f3fa;
  `;

  // Logo
  const logo = document.createElement('div');
  logo.style.cssText = 'font-size:1.4rem;margin-bottom:1rem;font-family:Orbitron,monospace;font-weight:800;';
  logo.innerHTML = `<span style="color:#ffffff;">Naija</span><span style="color:#3ED6B7;">Genius</span>`;
  card.appendChild(logo);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1.2rem;
    background: none;
    border: none;
    font-size: 1.8rem;
    color: #a0b3d9;
    cursor: pointer;
    line-height: 1;
    font-family: 'Poppins', sans-serif;
  `;
  closeBtn.addEventListener('click', () => overlay.remove());
  card.appendChild(closeBtn);

  // Greeting if login
  if (isLogin && username) {
    const greeting = document.createElement('p');
    greeting.style.cssText = `
      font-size: 1rem;
      font-weight: 500;
      color: #b9c7d9;
      margin-bottom: 0.8rem;
    `;
    greeting.innerHTML = `Hey <span style="color:#FFD700;font-weight:700;">${username}</span> 🇳🇬`;
    card.appendChild(greeting);
  }

  // Subheading
  const sub = document.createElement('span');
  sub.style.cssText = `
    color: #3ED6B7;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.6rem;
    display: block;
  `;
  sub.textContent = 'Did you know?';
  card.appendChild(sub);

  // Fun fact text
  const fact = document.createElement('p');
  fact.style.cssText = `
    color: #f0f3fa;
    font-size: 1rem;
    line-height: 1.75;
    font-weight: 400;
    margin-bottom: 0;
  `;
  fact.textContent = getRandomFunFact();
  card.appendChild(fact);

  // Button
  const btn = document.createElement('button');
  btn.textContent = 'Interesting! 👍';
  btn.style.cssText = `
    background: linear-gradient(135deg, #3ED6B7, #259c84);
    border: none;
    padding: 0.7rem 2rem;
    border-radius: 40px;
    font-weight: 700;
    font-size: 0.9rem;
    color: #0a0f1e;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    margin-top: 1.5rem;
    display: inline-block;
  `;
  btn.addEventListener('click', () => overlay.remove());
  card.appendChild(btn);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}