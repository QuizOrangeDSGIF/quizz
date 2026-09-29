"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* Configuration Firebase : remplacer par vos valeurs Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyBtIJMEyaxLS7wxVIqO5vgPndwRYeOjlnY",
  authDomain: "quiz-orange.firebaseapp.com",
  projectId: "quiz-orange",
  storageBucket: "quiz-orange.firebasestorage.app",
  messagingSenderId: "1050591189815",
  appId: "1:1050591189815:web:c3a004d9bea8b01300d8b2"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

/* Banque de questions */
const questionsBank = [
    {
        id: 1,
        question: "Quelle est la capitale de la France ?",
        options: ["Lyon", "Paris", "Marseille", "Lille"],
        answer: 1
    },
    {
        id: 2,
        question: "Combien y a-t-il de continents sur Terre ?",
        options: ["5", "6", "7", "8"],
        answer: 2
    },
    {
        id: 3,
        question: "Quelle planète est surnommée la planète rouge ?",
        options: ["Mars", "Jupiter", "Vénus", "Mercure"],
        answer: 0
    },
    {
        id: 4,
        question: "Quel est le plus grand océan du monde ?",
        options: ["Atlantique", "Indien", "Arctique", "Pacifique"],
        answer: 3
    },
    {
        id: 5,
        question: "Qui a écrit Les Misérables ?",
        options: ["Émile Zola", "Victor Hugo", "Molière", "Albert Camus"],
        answer: 1
    },
    {
        id: 6,
        question: "Combien de côtés possède un hexagone ?",
        options: ["5", "6", "7", "8"],
        answer: 1
    },
    {
        id: 7,
        question: "Quel animal produit la laine ?",
        options: ["La vache", "Le mouton", "Le cheval", "Le lapin"],
        answer: 1
    },
    {
        id: 8,
        question: "Quelle est la langue principalement parlée au Brésil ?",
        options: ["Espagnol", "Français", "Portugais", "Anglais"],
        answer: 2
    },
    {
        id: 9,
        question: "Quel est le symbole chimique de l'eau ?",
        options: ["O2", "CO2", "H2O", "NaCl"],
        answer: 2
    },
    {
        id: 10,
        question: "En quelle saison les feuilles tombent-elles généralement ?",
        options: ["Printemps", "Été", "Automne", "Hiver"],
        answer: 2
    },
    {
        id: 11,
        question: "Quel instrument possède habituellement 88 touches ?",
        options: ["Guitare", "Piano", "Violon", "Flûte"],
        answer: 1
    },
    {
        id: 12,
        question: "Quel pays a la forme d'une botte sur une carte ?",
        options: ["Italie", "Portugal", "Grèce", "Belgique"],
        answer: 0
    },
    {
        id: 13,
        question: "Combien de minutes y a-t-il dans une heure ?",
        options: ["30", "45", "60", "100"],
        answer: 2
    },
    {
        id: 14,
        question: "Quel est le plus grand mammifère du monde ?",
        options: ["Éléphant", "Baleine bleue", "Girafe", "Requin blanc"],
        answer: 1
    },
    {
        id: 15,
        question: "Quelle couleur obtient-on en mélangeant du bleu et du jaune ?",
        options: ["Orange", "Vert", "Violet", "Rose"],
        answer: 1
    },
    {
        id: 16,
        question: "Quel est le premier mois de l'année ?",
        options: ["Décembre", "Janvier", "Mars", "Février"],
        answer: 1
    },
    {
        id: 17,
        question: "Quel métal est principalement utilisé pour fabriquer les canettes ?",
        options: ["Or", "Aluminium", "Cuivre", "Argent"],
        answer: 1
    },
    {
        id: 18,
        question: "Quelle est la plus haute montagne du monde ?",
        options: ["Mont Blanc", "Kilimandjaro", "Everest", "Mont Fuji"],
        answer: 2
    },
    {
        id: 19,
        question: "Quel organe permet principalement de respirer ?",
        options: ["Le cœur", "Le foie", "Les poumons", "L'estomac"],
        answer: 2
    },
    {
        id: 20,
        question: "Combien de jours y a-t-il dans une semaine ?",
        options: ["5", "6", "7", "8"],
        answer: 2
    },
    {
        id: 21,
        question: "Quel est le satellite naturel de la Terre ?",
        options: ["Le Soleil", "Mars", "La Lune", "Vénus"],
        answer: 2
    },
    {
        id: 22,
        question: "Dans quel pays se trouve la ville de Tokyo ?",
        options: ["Chine", "Japon", "Corée du Sud", "Thaïlande"],
        answer: 1
    },
    {
        id: 23,
        question: "Quel est le résultat de 9 × 8 ?",
        options: ["63", "72", "81", "64"],
        answer: 1
    },
    {
        id: 24,
        question: "Quelle est la couleur du rubis ?",
        options: ["Bleu", "Vert", "Rouge", "Jaune"],
        answer: 2
    },
    {
        id: 25,
        question: "Quel écrivain a créé le personnage de Sherlock Holmes ?",
        options: ["Jules Verne", "Arthur Conan Doyle", "Agatha Christie", "Victor Hugo"],
        answer: 1
    },
    {
    id: 26,
    question: "Quelle est la capitale de l'Espagne ?",
    options: ["Barcelone", "Madrid", "Valence", "Séville"],
    answer: 1
},
{
    id: 27,
    question: "Quelle est la capitale de l'Italie ?",
    options: ["Milan", "Rome", "Naples", "Venise"],
    answer: 1
},
{
    id: 28,
    question: "Quel fleuve traverse Paris ?",
    options: ["Le Rhône", "La Loire", "La Seine", "La Garonne"],
    answer: 2
},
{
    id: 29,
    question: "Quel est le plus grand pays du monde par superficie ?",
    options: ["Le Canada", "La Chine", "Les États-Unis", "La Russie"],
    answer: 3
},
{
    id: 30,
    question: "Sur quel continent se trouve le désert du Sahara ?",
    options: ["Europe", "Afrique", "Asie", "Amérique du Sud"],
    answer: 1
},
{
    id: 31,
    question: "Quelle est la capitale du Canada ?",
    options: ["Toronto", "Vancouver", "Ottawa", "Montréal"],
    answer: 2
},
{
    id: 32,
    question: "Quel pays est surnommé le pays du Soleil-Levant ?",
    options: ["La Chine", "Le Japon", "La Corée du Sud", "La Thaïlande"],
    answer: 1
},
{
    id: 33,
    question: "Quelle mer sépare l'Europe de l'Afrique ?",
    options: ["La mer Noire", "La mer Baltique", "La mer Méditerranée", "La mer Rouge"],
    answer: 2
},
{
    id: 34,
    question: "Quelle est la capitale de l'Australie ?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    answer: 2
},
{
    id: 35,
    question: "Dans quel pays se trouvent les pyramides de Gizeh ?",
    options: ["Au Mexique", "En Égypte", "En Grèce", "En Inde"],
    answer: 1
},
{
    id: 36,
    question: "Quel est le plus long fleuve de France ?",
    options: ["La Seine", "Le Rhône", "La Loire", "La Garonne"],
    answer: 2
},
{
    id: 37,
    question: "Quelle est la capitale du Portugal ?",
    options: ["Porto", "Lisbonne", "Faro", "Coimbra"],
    answer: 1
},
{
    id: 38,
    question: "Quel pays est connu pour ses fjords ?",
    options: ["La Norvège", "L'Italie", "Le Maroc", "La Hongrie"],
    answer: 0
},
{
    id: 39,
    question: "Quelle est la capitale de la Belgique ?",
    options: ["Anvers", "Liège", "Bruxelles", "Gand"],
    answer: 2
},
{
    id: 40,
    question: "Quel océan borde la côte ouest de l'Amérique ?",
    options: ["Atlantique", "Pacifique", "Indien", "Arctique"],
    answer: 1
},
{
    id: 41,
    question: "Quelle monnaie est utilisée au Japon ?",
    options: ["Le yuan", "Le won", "Le yen", "Le dollar"],
    answer: 2
},
{
    id: 42,
    question: "Quel pays a pour capitale Athènes ?",
    options: ["La Grèce", "La Turquie", "Chypre", "La Bulgarie"],
    answer: 0
},
{
    id: 43,
    question: "Quelle est la capitale de l'Allemagne ?",
    options: ["Munich", "Francfort", "Berlin", "Hambourg"],
    answer: 2
},
{
    id: 44,
    question: "Quel volcan italien est situé près de Naples ?",
    options: ["L'Etna", "Le Vésuve", "Le Stromboli", "Le Piton de la Fournaise"],
    answer: 1
},
{
    id: 45,
    question: "Dans quel pays se situe la ville de Marrakech ?",
    options: ["En Algérie", "En Tunisie", "Au Maroc", "En Égypte"],
    answer: 2
},
{
    id: 46,
    question: "Qui fut le premier président de la Ve République française ?",
    options: ["Georges Pompidou", "Charles de Gaulle", "François Mitterrand", "Valéry Giscard d'Estaing"],
    answer: 1
},
{
    id: 47,
    question: "En quelle année a débuté la Révolution française ?",
    options: ["1789", "1815", "1914", "1945"],
    answer: 0
},
{
    id: 48,
    question: "Quel monument parisien a été construit pour l'Exposition universelle de 1889 ?",
    options: ["L'Arc de Triomphe", "La tour Eiffel", "Notre-Dame", "Le Sacré-Cœur"],
    answer: 1
},
{
    id: 49,
    question: "Qui a découvert l'Amérique en 1492 ?",
    options: ["Magellan", "Christophe Colomb", "Vasco de Gama", "James Cook"],
    answer: 1
},
{
    id: 50,
    question: "Quel roi français était surnommé le Roi-Soleil ?",
    options: ["Louis XIV", "Louis XVI", "François Ier", "Henri IV"],
    answer: 0
},
{
    id: 51,
    question: "Quelle ville romaine a été ensevelie par l'éruption du Vésuve en 79 ?",
    options: ["Pompéi", "Rome", "Florence", "Milan"],
    answer: 0
},
{
    id: 52,
    question: "Quel mur est tombé en 1989 ?",
    options: ["Le mur d'Hadrien", "Le mur de Berlin", "Le mur des Lamentations", "La Grande Muraille"],
    answer: 1
},
{
    id: 53,
    question: "Quelle reine d'Égypte était liée à Jules César et Marc Antoine ?",
    options: ["Néfertiti", "Cléopâtre", "Hatchepsout", "Cléopâtre II"],
    answer: 1
},
{
    id: 54,
    question: "Quel conflit a eu lieu de 1914 à 1918 ?",
    options: ["La guerre de Cent Ans", "La Première Guerre mondiale", "La Seconde Guerre mondiale", "La guerre froide"],
    answer: 1
},
{
    id: 55,
    question: "Qui a prononcé l'appel du 18 juin 1940 ?",
    options: ["Winston Churchill", "Charles de Gaulle", "Georges Clemenceau", "Jean Moulin"],
    answer: 1
},
{
    id: 56,
    question: "Quelle civilisation a construit Machu Picchu ?",
    options: ["Les Mayas", "Les Aztèques", "Les Incas", "Les Romains"],
    answer: 2
},
{
    id: 57,
    question: "Quel navigateur a réalisé le premier tour du monde, achevé par son expédition ?",
    options: ["Christophe Colomb", "Fernand de Magellan", "Jacques Cartier", "Marco Polo"],
    answer: 1
},
{
    id: 58,
    question: "Quel chef militaire français est devenu empereur en 1804 ?",
    options: ["Napoléon Bonaparte", "Louis-Philippe", "Charles X", "Jean Jaurès"],
    answer: 0
},
{
    id: 59,
    question: "Quelle bataille de 1815 marque la défaite finale de Napoléon ?",
    options: ["Austerlitz", "Marignan", "Waterloo", "Verdun"],
    answer: 2
},
{
    id: 60,
    question: "Quel peuple a construit le Colisée de Rome ?",
    options: ["Les Grecs", "Les Romains", "Les Égyptiens", "Les Vikings"],
    answer: 1
},
{
    id: 61,
    question: "Quel gaz est indispensable à la respiration humaine ?",
    options: ["L'azote", "L'oxygène", "Le dioxyde de carbone", "L'hélium"],
    answer: 1
},
{
    id: 62,
    question: "Combien de planètes composent le Système solaire ?",
    options: ["7", "8", "9", "10"],
    answer: 1
},
{
    id: 63,
    question: "Quel est l'astre au centre du Système solaire ?",
    options: ["La Lune", "Mars", "Le Soleil", "Jupiter"],
    answer: 2
},
{
    id: 64,
    question: "Quel est le symbole chimique de l'or ?",
    options: ["Or", "Au", "Ag", "Fe"],
    answer: 1
},
{
    id: 65,
    question: "Quelle est la formule chimique du dioxyde de carbone ?",
    options: ["CO", "CO2", "H2O", "O2"],
    answer: 1
},
{
    id: 66,
    question: "Quel organe pompe le sang dans le corps humain ?",
    options: ["Le cerveau", "Le foie", "Le cœur", "Le rein"],
    answer: 2
},
{
    id: 67,
    question: "Quel est l'état de l'eau à 0 °C dans des conditions normales ?",
    options: ["Gazeux", "Solide", "Liquide uniquement", "Plasma"],
    answer: 1
},
{
    id: 68,
    question: "Quel animal est un amphibien ?",
    options: ["La grenouille", "Le lézard", "Le pigeon", "Le requin"],
    answer: 0
},
{
    id: 69,
    question: "Quel est le plus petit os du corps humain ?",
    options: ["Le fémur", "L'étrier", "Le tibia", "Le radius"],
    answer: 1
},
{
    id: 70,
    question: "Quelle partie de la plante absorbe principalement l'eau du sol ?",
    options: ["La fleur", "La feuille", "La racine", "Le fruit"],
    answer: 2
},
{
    id: 71,
    question: "Quel scientifique a formulé la loi de la gravitation universelle ?",
    options: ["Albert Einstein", "Isaac Newton", "Galilée", "Louis Pasteur"],
    answer: 1
},
{
    id: 72,
    question: "Quel métal est liquide à température ambiante ?",
    options: ["Le fer", "Le cuivre", "Le mercure", "L'aluminium"],
    answer: 2
},
{
    id: 73,
    question: "Quelle planète est la plus proche du Soleil ?",
    options: ["Vénus", "Mercure", "Mars", "La Terre"],
    answer: 1
},
{
    id: 74,
    question: "Quelle planète possède les anneaux les plus visibles ?",
    options: ["Saturne", "Mars", "Vénus", "Mercure"],
    answer: 0
},
{
    id: 75,
    question: "Combien de pattes possède une araignée ?",
    options: ["6", "8", "10", "12"],
    answer: 1
},
{
    id: 76,
    question: "Quel animal est le plus grand félin ?",
    options: ["Le lion", "Le tigre", "Le guépard", "Le léopard"],
    answer: 1
},
{
    id: 77,
    question: "Quel est le nom du processus par lequel les plantes fabriquent leur énergie grâce à la lumière ?",
    options: ["La respiration", "La photosynthèse", "La fermentation", "La digestion"],
    answer: 1
},
{
    id: 78,
    question: "Quel scientifique est associé à la théorie de la relativité ?",
    options: ["Marie Curie", "Albert Einstein", "Charles Darwin", "Nikola Tesla"],
    answer: 1
},
{
    id: 79,
    question: "Quel est le nom de la galaxie où se trouve le Système solaire ?",
    options: ["Andromède", "La Voie lactée", "Orion", "La Grande Ourse"],
    answer: 1
},
{
    id: 80,
    question: "Quelle vitamine est produite par la peau sous l'action du soleil ?",
    options: ["Vitamine A", "Vitamine B12", "Vitamine C", "Vitamine D"],
    answer: 3
},
{
    id: 81,
    question: "Qui a écrit Le Petit Prince ?",
    options: ["Jules Verne", "Antoine de Saint-Exupéry", "Marcel Proust", "Albert Camus"],
    answer: 1
},
{
    id: 82,
    question: "Qui a écrit Roméo et Juliette ?",
    options: ["William Shakespeare", "Molière", "Charles Dickens", "Voltaire"],
    answer: 0
},
{
    id: 83,
    question: "Quel peintre a réalisé La Joconde ?",
    options: ["Claude Monet", "Léonard de Vinci", "Pablo Picasso", "Vincent van Gogh"],
    answer: 1
},
{
    id: 84,
    question: "Dans quel musée est exposée La Joconde ?",
    options: ["Le musée d'Orsay", "Le Louvre", "Le Centre Pompidou", "Le musée Rodin"],
    answer: 1
},
{
    id: 85,
    question: "Quel compositeur a écrit La Flûte enchantée ?",
    options: ["Mozart", "Beethoven", "Bach", "Chopin"],
    answer: 0
},
{
    id: 86,
    question: "Quel écrivain français a écrit Vingt mille lieues sous les mers ?",
    options: ["Jules Verne", "Victor Hugo", "Émile Zola", "Guy de Maupassant"],
    answer: 0
},
{
    id: 87,
    question: "Quel mouvement artistique est associé à Claude Monet ?",
    options: ["Le cubisme", "L'impressionnisme", "Le surréalisme", "Le romantisme"],
    answer: 1
},
{
    id: 88,
    question: "Quel peintre est célèbre pour avoir peint des tournesols ?",
    options: ["Salvador Dalí", "Vincent van Gogh", "Henri Matisse", "Paul Cézanne"],
    answer: 1
},
{
    id: 89,
    question: "Qui a écrit la pièce Le Malade imaginaire ?",
    options: ["Molière", "Racine", "Corneille", "Beaumarchais"],
    answer: 0
},
{
    id: 90,
    question: "Quel art utilise principalement des sons organisés ?",
    options: ["La sculpture", "La musique", "La peinture", "L'architecture"],
    answer: 1
},
{
    id: 91,
    question: "Quel instrument est joué avec un archet ?",
    options: ["Le violon", "La trompette", "Le piano", "La batterie"],
    answer: 0
},
{
    id: 92,
    question: "Quel auteur a écrit Harry Potter ?",
    options: ["J. R. R. Tolkien", "J. K. Rowling", "Stephen King", "Agatha Christie"],
    answer: 1
},
{
    id: 93,
    question: "Quel personnage de fiction vit au 221B Baker Street ?",
    options: ["Hercule Poirot", "Sherlock Holmes", "Arsène Lupin", "Tintin"],
    answer: 1
},
{
    id: 94,
    question: "Qui a peint le tableau Guernica ?",
    options: ["Pablo Picasso", "Paul Gauguin", "Édouard Manet", "Joan Miró"],
    answer: 0
},
{
    id: 95,
    question: "Quel écrivain a créé le personnage d'Arsène Lupin ?",
    options: ["Maurice Leblanc", "Georges Simenon", "Alexandre Dumas", "Honoré de Balzac"],
    answer: 0
},
{
    id: 96,
    question: "Combien font 12 multiplié par 12 ?",
    options: ["124", "132", "144", "156"],
    answer: 2
},
{
    id: 97,
    question: "Quel est le résultat de 100 divisé par 4 ?",
    options: ["20", "25", "30", "40"],
    answer: 1
},
{
    id: 98,
    question: "Combien de côtés possède un triangle ?",
    options: ["3", "4", "5", "6"],
    answer: 0
},
{
    id: 99,
    question: "Quel nombre vient après 99 ?",
    options: ["98", "100", "101", "110"],
    answer: 1
},
{
    id: 100,
    question: "Quelle est la moitié de 50 ?",
    options: ["20", "25", "30", "35"],
    answer: 1
},
{
    id: 101,
    question: "Combien font 7 plus 8 ?",
    options: ["13", "14", "15", "16"],
    answer: 2
},
{
    id: 102,
    question: "Quel est le résultat de 9 au carré ?",
    options: ["18", "27", "72", "81"],
    answer: 3
},
{
    id: 103,
    question: "Combien de mois compte une année ?",
    options: ["10", "11", "12", "13"],
    answer: 2
},
{
    id: 104,
    question: "Combien de secondes y a-t-il dans une minute ?",
    options: ["30", "45", "60", "100"],
    answer: 2
},
{
    id: 105,
    question: "Quel chiffre romain représente le nombre 10 ?",
    options: ["V", "X", "L", "C"],
    answer: 1
},
{
    id: 106,
    question: "Quel sport se joue avec une raquette et un volant ?",
    options: ["Le tennis", "Le badminton", "Le squash", "Le ping-pong"],
    answer: 1
},
{
    id: 107,
    question: "Combien de joueurs une équipe de football aligne-t-elle sur le terrain au début d'un match ?",
    options: ["9", "10", "11", "12"],
    answer: 2
},
{
    id: 108,
    question: "Dans quel sport utilise-t-on un panier ?",
    options: ["Le rugby", "Le basketball", "Le football", "Le handball"],
    answer: 1
},
{
    id: 109,
    question: "Quel pays a inventé les Jeux olympiques antiques ?",
    options: ["La France", "L'Italie", "La Grèce", "L'Égypte"],
    answer: 2
},
{
    id: 110,
    question: "Quel sport se pratique sur une piste avec des skis ?",
    options: ["Le surf", "Le ski", "La voile", "Le golf"],
    answer: 1
},
{
    id: 111,
    question: "Quelle couleur de carton indique généralement une exclusion au football ?",
    options: ["Bleu", "Vert", "Jaune", "Rouge"],
    answer: 3
},
{
    id: 112,
    question: "Dans quel sport célèbre-t-on un essai ?",
    options: ["Le rugby", "Le tennis", "Le cyclisme", "L'escrime"],
    answer: 0
},
{
    id: 113,
    question: "Quel tournoi de tennis se joue sur terre battue à Paris ?",
    options: ["Wimbledon", "Roland-Garros", "US Open", "Open d'Australie"],
    answer: 1
},
{
    id: 114,
    question: "Quel sport est associé au Tour de France ?",
    options: ["La course à pied", "Le cyclisme", "La natation", "L'automobile"],
    answer: 1
},
{
    id: 115,
    question: "Quel objet utilise-t-on pour jouer au golf ?",
    options: ["Une batte", "Un club", "Une raquette", "Une crosse"],
    answer: 1
},
{
    id: 116,
    question: "Quel appareil permet de téléphoner sans fil ?",
    options: ["Un téléphone portable", "Une imprimante", "Un scanner", "Un projecteur"],
    answer: 0
},
{
    id: 117,
    question: "Quel périphérique permet de saisir du texte sur un ordinateur ?",
    options: ["Une souris", "Un écran", "Un clavier", "Une enceinte"],
    answer: 2
},
{
    id: 118,
    question: "Que signifie l'abréviation WWW sur Internet ?",
    options: ["World Wide Web", "Web World Window", "Wide Web World", "World Web Wire"],
    answer: 0
},
{
    id: 119,
    question: "Quel symbole est généralement utilisé dans une adresse e-mail ?",
    options: ["#", "@", "&", "%"],
    answer: 1
},
{
    id: 120,
    question: "Quel navigateur web est développé par Mozilla ?",
    options: ["Chrome", "Safari", "Firefox", "Edge"],
    answer: 2
},
{
    id: 121,
    question: "Quel fruit est traditionnellement utilisé pour faire du cidre ?",
    options: ["La pomme", "La poire", "La cerise", "La pêche"],
    answer: 0
},
{
    id: 122,
    question: "Quel ingrédient est indispensable pour fabriquer du pain traditionnel ?",
    options: ["La farine", "Le chocolat", "Le riz", "Le fromage"],
    answer: 0
},
{
    id: 123,
    question: "Quelle boisson est obtenue à partir de feuilles infusées ?",
    options: ["Le thé", "Le lait", "Le jus d'orange", "Le soda"],
    answer: 0
},
{
    id: 124,
    question: "Quel ustensile sert à couper les aliments ?",
    options: ["Une cuillère", "Une fourchette", "Un couteau", "Un verre"],
    answer: 2
},
{
    id: 125,
    question: "Quel jour vient après le vendredi ?",
    options: ["Jeudi", "Samedi", "Dimanche", "Lundi"],
    answer: 1
},
    {
    id: 126,
    question: "Quelle est la capitale de la Suisse ?",
    options: ["Zurich", "Genève", "Berne", "Lausanne"],
    answer: 2
},
{
    id: 127,
    question: "Dans quel pays se trouve la ville de Dublin ?",
    options: ["Écosse", "Irlande", "Pays de Galles", "Angleterre"],
    answer: 1
},
{
    id: 128,
    question: "Quel pays a la forme d'un hexagone sur une carte ?",
    options: ["La France", "L'Espagne", "L'Allemagne", "La Pologne"],
    answer: 0
},
{
    id: 129,
    question: "Quelle est la capitale de la Suède ?",
    options: ["Oslo", "Stockholm", "Helsinki", "Copenhague"],
    answer: 1
},
{
    id: 130,
    question: "Quel fleuve traverse Londres ?",
    options: ["La Tamise", "Le Danube", "Le Rhin", "La Seine"],
    answer: 0
},
{
    id: 131,
    question: "Sur quel continent se trouve le Brésil ?",
    options: ["Afrique", "Asie", "Amérique du Sud", "Europe"],
    answer: 2
},
{
    id: 132,
    question: "Quelle est la capitale de la Norvège ?",
    options: ["Oslo", "Bergen", "Trondheim", "Stavanger"],
    answer: 0
},
{
    id: 133,
    question: "Dans quel pays se trouve le Taj Mahal ?",
    options: ["Inde", "Chine", "Japon", "Népal"],
    answer: 0
},
{
    id: 134,
    question: "Quelle île est la plus grande du monde ?",
    options: ["Madagascar", "Le Groenland", "L'Islande", "La Nouvelle-Guinée"],
    answer: 1
},
{
    id: 135,
    question: "Quel pays est traversé par le Nil ?",
    options: ["Égypte", "Espagne", "Canada", "Australie"],
    answer: 0
},
{
    id: 136,
    question: "Quelle est la capitale de l'Autriche ?",
    options: ["Salzbourg", "Vienne", "Graz", "Innsbruck"],
    answer: 1
},
{
    id: 137,
    question: "Dans quel pays se trouve le mont Fuji ?",
    options: ["Chine", "Japon", "Corée du Sud", "Vietnam"],
    answer: 1
},
{
    id: 138,
    question: "Quelle est la capitale de la Finlande ?",
    options: ["Helsinki", "Stockholm", "Reykjavik", "Tallinn"],
    answer: 0
},
{
    id: 139,
    question: "Quelle ville est surnommée la Big Apple ?",
    options: ["Los Angeles", "Chicago", "New York", "Boston"],
    answer: 2
},
{
    id: 140,
    question: "Quel pays possède la ville de Rio de Janeiro ?",
    options: ["Argentine", "Brésil", "Mexique", "Portugal"],
    answer: 1
},
{
    id: 141,
    question: "Quel ancien peuple vivait dans la Rome antique ?",
    options: ["Les Romains", "Les Vikings", "Les Incas", "Les Celtes"],
    answer: 0
},
{
    id: 142,
    question: "Quel événement historique est célébré en France le 14 juillet ?",
    options: ["La prise de la Bastille", "L'armistice de 1918", "La fête du Travail", "La fin de la Seconde Guerre mondiale"],
    answer: 0
},
{
    id: 143,
    question: "Qui était Jeanne d'Arc ?",
    options: ["Une reine d'Angleterre", "Une héroïne française", "Une écrivaine italienne", "Une impératrice romaine"],
    answer: 1
},
{
    id: 144,
    question: "Quel paquebot a coulé en 1912 après avoir heurté un iceberg ?",
    options: ["Le Britannic", "Le Titanic", "Le Queen Mary", "Le Lusitania"],
    answer: 1
},
{
    id: 145,
    question: "Quelle ville fut ensevelie par le Vésuve avec Pompéi ?",
    options: ["Herculanum", "Athènes", "Carthage", "Sparte"],
    answer: 0
},
{
    id: 146,
    question: "Quel président américain est associé à l'émancipation des esclaves ?",
    options: ["George Washington", "Abraham Lincoln", "Theodore Roosevelt", "John Kennedy"],
    answer: 1
},
{
    id: 147,
    question: "Quelle civilisation a inventé les hiéroglyphes ?",
    options: ["Les Égyptiens", "Les Vikings", "Les Romains", "Les Mayas"],
    answer: 0
},
{
    id: 148,
    question: "Quel explorateur a donné son nom à l'Amérique ?",
    options: ["Amerigo Vespucci", "Marco Polo", "James Cook", "Jacques Cartier"],
    answer: 0
},
{
    id: 149,
    question: "Quelle guerre a opposé la France et l'Angleterre pendant plus d'un siècle ?",
    options: ["La guerre de Sept Ans", "La guerre de Cent Ans", "La guerre froide", "La guerre de Crimée"],
    answer: 1
},
{
    id: 150,
    question: "Quel roi français a dit : « Paris vaut bien une messe » ?",
    options: ["Henri IV", "Louis XIV", "Louis IX", "François Ier"],
    answer: 0
},
{
    id: 151,
    question: "Quel scientifique français est connu pour ses travaux sur les microbes ?",
    options: ["Louis Pasteur", "Blaise Pascal", "Antoine Lavoisier", "André-Marie Ampère"],
    answer: 0
},
{
    id: 152,
    question: "Quelle force nous maintient au sol ?",
    options: ["Le magnétisme", "La gravité", "L'électricité", "La pression"],
    answer: 1
},
{
    id: 153,
    question: "Quel est le symbole chimique du fer ?",
    options: ["Fr", "Fe", "Fi", "Ir"],
    answer: 1
},
{
    id: 154,
    question: "Quel est l'organe principal de la vision ?",
    options: ["L'oreille", "L'œil", "Le nez", "La peau"],
    answer: 1
},
{
    id: 155,
    question: "Comment appelle-t-on un animal qui mange uniquement des végétaux ?",
    options: ["Carnivore", "Herbivore", "Omnivore", "Insectivore"],
    answer: 1
},
{
    id: 156,
    question: "Quelle couche gazeuse protège la Terre des rayons ultraviolets ?",
    options: ["La couche d'ozone", "La troposphère", "La stratosphère", "La vapeur d'eau"],
    answer: 0
},
{
    id: 157,
    question: "Quel est le principal gaz présent dans l'air ?",
    options: ["Oxygène", "Azote", "Dioxyde de carbone", "Hydrogène"],
    answer: 1
},
{
    id: 158,
    question: "Quel insecte produit du miel ?",
    options: ["La fourmi", "L'abeille", "Le papillon", "La coccinelle"],
    answer: 1
},
{
    id: 159,
    question: "Quel animal est connu pour changer de couleur afin de se camoufler ?",
    options: ["Le chameau", "Le caméléon", "Le dauphin", "Le hérisson"],
    answer: 1
},
{
    id: 160,
    question: "Quel est le nom de l'étoile autour de laquelle tourne la Terre ?",
    options: ["Sirius", "Le Soleil", "Polaris", "Véga"],
    answer: 1
},
{
    id: 161,
    question: "Qui a écrit Les Fables ?",
    options: ["Jean de La Fontaine", "Molière", "Voltaire", "Rabelais"],
    answer: 0
},
{
    id: 162,
    question: "Quel auteur a écrit L'Étranger ?",
    options: ["Albert Camus", "Victor Hugo", "Gustave Flaubert", "Honoré de Balzac"],
    answer: 0
},
{
    id: 163,
    question: "Qui a peint La Nuit étoilée ?",
    options: ["Vincent van Gogh", "Claude Monet", "Edgar Degas", "Paul Cézanne"],
    answer: 0
},
{
    id: 164,
    question: "Quel peintre est associé au cubisme avec Georges Braque ?",
    options: ["Pablo Picasso", "Salvador Dalí", "Auguste Renoir", "Henri Rousseau"],
    answer: 0
},
{
    id: 165,
    question: "Quel auteur a écrit Le Comte de Monte-Cristo ?",
    options: ["Alexandre Dumas", "Jules Verne", "Émile Zola", "Stendhal"],
    answer: 0
},
{
    id: 166,
    question: "Quel compositeur est devenu sourd à la fin de sa vie ?",
    options: ["Mozart", "Beethoven", "Vivaldi", "Bach"],
    answer: 1
},
{
    id: 167,
    question: "Quel artiste est connu pour ses montres molles dans ses tableaux ?",
    options: ["Salvador Dalí", "Pablo Picasso", "Claude Monet", "Paul Klee"],
    answer: 0
},
{
    id: 168,
    question: "Quelle œuvre de Victor Hugo raconte l'histoire de Jean Valjean ?",
    options: ["Notre-Dame de Paris", "Les Misérables", "Hernani", "Ruy Blas"],
    answer: 1
},
{
    id: 169,
    question: "Quel personnage de bande dessinée est accompagné du chien Milou ?",
    options: ["Astérix", "Tintin", "Lucky Luke", "Spirou"],
    answer: 1
},
{
    id: 170,
    question: "Qui a créé le personnage d'Astérix avec Albert Uderzo ?",
    options: ["René Goscinny", "Hergé", "Franquin", "Morris"],
    answer: 0
},
{
    id: 171,
    question: "Combien font 15 plus 27 ?",
    options: ["40", "41", "42", "43"],
    answer: 2
},
{
    id: 172,
    question: "Quel est le résultat de 6 multiplié par 7 ?",
    options: ["36", "40", "42", "48"],
    answer: 2
},
{
    id: 173,
    question: "Combien font 81 moins 19 ?",
    options: ["60", "61", "62", "63"],
    answer: 2
},
{
    id: 174,
    question: "Quel est le double de 35 ?",
    options: ["60", "65", "70", "75"],
    answer: 2
},
{
    id: 175,
    question: "Quelle fraction correspond à la moitié ?",
    options: ["1/3", "1/2", "1/4", "2/3"],
    answer: 1
},
{
    id: 176,
    question: "Combien font 144 divisé par 12 ?",
    options: ["10", "11", "12", "13"],
    answer: 2
},
{
    id: 177,
    question: "Quel est le nombre impair parmi ces propositions ?",
    options: ["12", "18", "21", "24"],
    answer: 2
},
{
    id: 178,
    question: "Combien de degrés compte un angle droit ?",
    options: ["45", "90", "180", "360"],
    answer: 1
},
{
    id: 179,
    question: "Quel est le résultat de 5 puissance 2 ?",
    options: ["10", "15", "20", "25"],
    answer: 3
},
{
    id: 180,
    question: "Combien de centimètres font un mètre ?",
    options: ["10", "100", "1 000", "10 000"],
    answer: 1
},
{
    id: 181,
    question: "Dans quel sport utilise-t-on une balle ovale ?",
    options: ["Le football", "Le rugby", "Le tennis", "Le volleyball"],
    answer: 1
},
{
    id: 182,
    question: "Combien de joueurs une équipe de basketball aligne-t-elle sur le terrain ?",
    options: ["5", "6", "7", "11"],
    answer: 0
},
{
    id: 183,
    question: "Quel sport se pratique avec des gants sur un ring ?",
    options: ["L'escrime", "La boxe", "Le judo", "Le tennis"],
    answer: 1
},
{
    id: 184,
    question: "Quel pays est associé à la naissance du judo ?",
    options: ["La Chine", "Le Japon", "La Corée du Sud", "La Thaïlande"],
    answer: 1
},
{
    id: 185,
    question: "Quel sport utilise une planche et des vagues ?",
    options: ["Le ski", "Le surf", "Le patinage", "L'aviron"],
    answer: 1
},
{
    id: 186,
    question: "Dans quel sport utilise-t-on un fleuret ?",
    options: ["L'escrime", "Le golf", "Le hockey", "Le cricket"],
    answer: 0
},
{
    id: 187,
    question: "Quel sport consiste à parcourir 42,195 kilomètres ?",
    options: ["Le marathon", "Le triathlon", "Le décathlon", "Le sprint"],
    answer: 0
},
{
    id: 188,
    question: "Quel sport se joue habituellement sur une patinoire ?",
    options: ["Le hockey sur glace", "Le baseball", "Le handball", "Le rugby"],
    answer: 0
},
{
    id: 189,
    question: "Quel nageur français a remporté plusieurs médailles olympiques en 2008 et 2012 ?",
    options: ["Laure Manaudou", "Alain Bernard", "Florent Manaudou", "Yannick Agnel"],
    answer: 3
},
{
    id: 190,
    question: "Quel sport est associé au maillot jaune ?",
    options: ["Le cyclisme", "Le football", "Le tennis", "La natation"],
    answer: 0
},
{
    id: 191,
    question: "Quel objet permet de stocker des fichiers sur un ordinateur ?",
    options: ["Un disque dur", "Un clavier", "Une souris", "Un écran"],
    answer: 0
},
{
    id: 192,
    question: "Que signifie PDF ?",
    options: ["Portable Document Format", "Personal Data File", "Public Digital Folder", "Program Data Form"],
    answer: 0
},
{
    id: 193,
    question: "Quel logiciel permet généralement de naviguer sur Internet ?",
    options: ["Un navigateur", "Un tableur", "Un traitement de texte", "Un antivirus"],
    answer: 0
},
{
    id: 194,
    question: "Quel raccourci clavier permet généralement de copier du texte sous Windows ?",
    options: ["Ctrl + X", "Ctrl + C", "Ctrl + V", "Ctrl + Z"],
    answer: 1
},
{
    id: 195,
    question: "Quel raccourci clavier permet généralement de coller du texte sous Windows ?",
    options: ["Ctrl + A", "Ctrl + C", "Ctrl + V", "Ctrl + S"],
    answer: 2
},
{
    id: 196,
    question: "Qu'est-ce qu'un mot de passe robuste doit généralement contenir ?",
    options: ["Seulement son prénom", "Une combinaison variée de caractères", "Uniquement des chiffres", "La date de naissance"],
    answer: 1
},
{
    id: 197,
    question: "Quel protocole sécurise généralement un site web ?",
    options: ["HTTP", "HTTPS", "FTP", "SMTP"],
    answer: 1
},
{
    id: 198,
    question: "Quel symbole indique souvent une connexion sécurisée dans un navigateur ?",
    options: ["Une étoile", "Un cadenas", "Un drapeau", "Une loupe"],
    answer: 1
},
{
    id: 199,
    question: "Quel type de logiciel malveillant demande souvent une rançon ?",
    options: ["Un pare-feu", "Un ransomware", "Un navigateur", "Un tableur"],
    answer: 1
},
{
    id: 200,
    question: "Quelle action est recommandée avant de cliquer sur un lien inattendu ?",
    options: ["Vérifier l'expéditeur", "Le transférer à tous", "Saisir son mot de passe", "Désactiver l'antivirus"],
    answer: 0
},
{
    id: 201,
    question: "Quel fromage italien est souvent utilisé sur les pizzas ?",
    options: ["Mozzarella", "Roquefort", "Comté", "Cheddar"],
    answer: 0
},
{
    id: 202,
    question: "Quel fruit donne les raisins secs ?",
    options: ["La pomme", "Le raisin", "La prune", "La figue"],
    answer: 1
},
{
    id: 203,
    question: "Quel légume est principalement utilisé pour faire des frites ?",
    options: ["La carotte", "La pomme de terre", "La courgette", "L'aubergine"],
    answer: 1
},
{
    id: 204,
    question: "Quel ingrédient donne sa couleur jaune à une omelette ?",
    options: ["Le blanc d'œuf", "Le jaune d'œuf", "Le sel", "La farine"],
    answer: 1
},
{
    id: 205,
    question: "Quel aliment est produit par les abeilles ?",
    options: ["Le miel", "Le beurre", "Le fromage", "Le café"],
    answer: 0
},
{
    id: 206,
    question: "Quel jour est traditionnellement associé au début du week-end en France ?",
    options: ["Jeudi", "Vendredi", "Samedi", "Dimanche"],
    answer: 2
},
{
    id: 207,
    question: "Combien de jours compte une année normale ?",
    options: ["360", "364", "365", "366"],
    answer: 2
},
{
    id: 208,
    question: "Quel mois compte généralement 28 jours ?",
    options: ["Février", "Mars", "Avril", "Mai"],
    answer: 0
},
{
    id: 209,
    question: "Quelle saison commence généralement autour du 21 juin dans l'hémisphère nord ?",
    options: ["Le printemps", "L'été", "L'automne", "L'hiver"],
    answer: 1
},
{
    id: 210,
    question: "Quel moment de la journée vient après l'après-midi ?",
    options: ["Le matin", "Le soir", "L'aube", "Midi"],
    answer: 1
},
{
    id: 211,
    question: "Quel acteur interprète le personnage de Harry Potter au cinéma ?",
    options: ["Daniel Radcliffe", "Elijah Wood", "Tom Holland", "Robert Pattinson"],
    answer: 0
},
{
    id: 212,
    question: "Quel film d'animation met en scène un jouet nommé Buzz l'Éclair ?",
    options: ["Cars", "Toy Story", "Shrek", "Le Roi Lion"],
    answer: 1
},
{
    id: 213,
    question: "Quel personnage vit dans un ananas sous la mer ?",
    options: ["Mickey", "Bob l'éponge", "Simba", "Donald"],
    answer: 1
},
{
    id: 214,
    question: "Quelle saga met en scène le personnage de Luke Skywalker ?",
    options: ["Harry Potter", "Star Wars", "Le Seigneur des anneaux", "Indiana Jones"],
    answer: 1
},
{
    id: 215,
    question: "Quel super-héros est connu pour son marteau Mjolnir ?",
    options: ["Batman", "Thor", "Spider-Man", "Superman"],
    answer: 1
},
{
    id: 216,
    question: "Quelle couleur obtient-on en mélangeant du rouge et du blanc ?",
    options: ["Vert", "Violet", "Rose", "Orange"],
    answer: 2
},
{
    id: 217,
    question: "Quelle couleur obtient-on en mélangeant du rouge et du bleu ?",
    options: ["Violet", "Vert", "Jaune", "Marron"],
    answer: 0
},
{
    id: 218,
    question: "Quel animal est souvent associé à la lenteur ?",
    options: ["Le guépard", "L'escargot", "Le cheval", "Le dauphin"],
    answer: 1
},
{
    id: 219,
    question: "Quel animal est souvent appelé le meilleur ami de l'homme ?",
    options: ["Le chat", "Le chien", "Le cheval", "Le lapin"],
    answer: 1
},
{
    id: 220,
    question: "Quel animal porte sa maison sur son dos ?",
    options: ["Le hérisson", "L'escargot", "La tortue", "Le crabe"],
    answer: 2
},
{
    id: 221,
    question: "Quelle langue est principalement parlée en Allemagne ?",
    options: ["L'allemand", "Le néerlandais", "Le suédois", "Le danois"],
    answer: 0
},
{
    id: 222,
    question: "Comment dit-on « bonjour » en anglais ?",
    options: ["Gracias", "Hello", "Ciao", "Danke"],
    answer: 1
},
{
    id: 223,
    question: "Comment dit-on « merci » en espagnol ?",
    options: ["Grazie", "Merci", "Gracias", "Danke"],
    answer: 2
},
{
    id: 224,
    question: "Quel signe de ponctuation termine généralement une question ?",
    options: ["Le point", "La virgule", "Le point d'interrogation", "Le point-virgule"],
    answer: 2
},
{
    id: 225,
    question: "Quel mot est le contraire de « chaud » ?",
    options: ["Tiède", "Froid", "Brûlant", "Humide"],
    answer: 1
},
    {
    id: 226,
    question: "Quel détroit sépare l'Europe de l'Afrique entre l'Espagne et le Maroc ?",
    options: ["Le détroit de Béring", "Le détroit de Gibraltar", "Le détroit de Malacca", "Le Bosphore"],
    answer: 1
},
{
    id: 227,
    question: "Quelle est la capitale de la Mongolie ?",
    options: ["Astana", "Bichkek", "Oulan-Bator", "Douchanbé"],
    answer: 2
},
{
    id: 228,
    question: "Quel fleuve traverse Budapest ?",
    options: ["Le Rhin", "Le Danube", "La Volga", "L'Elbe"],
    answer: 1
},
{
    id: 229,
    question: "Quel pays est entièrement enclavé dans l'Afrique du Sud ?",
    options: ["Eswatini", "Lesotho", "Botswana", "Namibie"],
    answer: 1
},
{
    id: 230,
    question: "Quel est le point culminant de l'Afrique ?",
    options: ["Le mont Kenya", "Le Kilimandjaro", "Le mont Elbrouz", "L'Atlas"],
    answer: 1
},
{
    id: 231,
    question: "Quel traité de 1919 a officiellement mis fin à la Première Guerre mondiale ?",
    options: ["Le traité de Rome", "Le traité de Versailles", "Le traité de Maastricht", "Le traité de Tordesillas"],
    answer: 1
},
{
    id: 232,
    question: "Quel empereur romain est associé à l'incendie de Rome en 64 ?",
    options: ["Auguste", "Néron", "Trajan", "Jules César"],
    answer: 1
},
{
    id: 233,
    question: "Quelle bataille de 732 est traditionnellement associée à Charles Martel ?",
    options: ["Bouvines", "Poitiers", "Austerlitz", "Marignan"],
    answer: 1
},
{
    id: 234,
    question: "Quelle dynastie française a succédé aux Mérovingiens ?",
    options: ["Les Capétiens", "Les Carolingiens", "Les Valois", "Les Bourbons"],
    answer: 1
},
{
    id: 235,
    question: "Quel pharaon est associé à la tombe découverte presque intacte en 1922 ?",
    options: ["Ramsès II", "Toutânkhamon", "Akhenaton", "Khéops"],
    answer: 1
},
{
    id: 236,
    question: "Quel physicien a découvert la radioactivité naturelle ?",
    options: ["Henri Becquerel", "Niels Bohr", "Max Planck", "Michael Faraday"],
    answer: 0
},
{
    id: 237,
    question: "Quelle particule possède une charge électrique négative ?",
    options: ["Le proton", "Le neutron", "L'électron", "Le photon"],
    answer: 2
},
{
    id: 238,
    question: "Quel est le numéro atomique de l'oxygène ?",
    options: ["6", "7", "8", "16"],
    answer: 2
},
{
    id: 239,
    question: "Comment appelle-t-on le passage direct d'un solide à un gaz ?",
    options: ["Fusion", "Condensation", "Sublimation", "Vaporisation"],
    answer: 2
},
{
    id: 240,
    question: "Quel scientifique a proposé la sélection naturelle comme mécanisme de l'évolution ?",
    options: ["Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Galilée"],
    answer: 1
},
{
    id: 241,
    question: "Quel écrivain a écrit À la recherche du temps perdu ?",
    options: ["Marcel Proust", "André Gide", "Émile Zola", "Paul Valéry"],
    answer: 0
},
{
    id: 242,
    question: "Qui est l'auteur du roman 1984 ?",
    options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Franz Kafka"],
    answer: 1
},
{
    id: 243,
    question: "Quel peintre a réalisé Le Cri ?",
    options: ["Edvard Munch", "Gustav Klimt", "Paul Klee", "René Magritte"],
    answer: 0
},
{
    id: 244,
    question: "Quel mouvement artistique est associé à André Breton ?",
    options: ["Le réalisme", "Le surréalisme", "Le fauvisme", "Le baroque"],
    answer: 1
},
{
    id: 245,
    question: "Quel compositeur a écrit Les Quatre Saisons ?",
    options: ["Antonio Vivaldi", "Georg Friedrich Haendel", "Joseph Haydn", "Franz Schubert"],
    answer: 0
},
{
    id: 246,
    question: "Quel est le résultat de 17 multiplié par 13 ?",
    options: ["211", "221", "231", "241"],
    answer: 1
},
{
    id: 247,
    question: "Quel nombre est un nombre premier ?",
    options: ["21", "27", "29", "33"],
    answer: 2
},
{
    id: 248,
    question: "Quelle est la racine carrée de 169 ?",
    options: ["11", "12", "13", "14"],
    answer: 2
},
{
    id: 249,
    question: "Quel est le résultat de 2 puissance 10 ?",
    options: ["100", "512", "1 000", "1 024"],
    answer: 3
},
{
    id: 250,
    question: "Quelle est la somme des angles intérieurs d'un triangle ?",
    options: ["90 degrés", "180 degrés", "270 degrés", "360 degrés"],
    answer: 1
},
{
    id: 251,
    question: "Quel pays a remporté la première Coupe du monde de football en 1930 ?",
    options: ["Brésil", "Italie", "Uruguay", "Argentine"],
    answer: 2
},
{
    id: 252,
    question: "Dans quel sport peut-on réaliser un birdie ?",
    options: ["Le golf", "Le tennis", "Le baseball", "Le cricket"],
    answer: 0
},
{
    id: 253,
    question: "Quel pays organise traditionnellement le tournoi de Wimbledon ?",
    options: ["Les États-Unis", "L'Australie", "Le Royaume-Uni", "La France"],
    answer: 2
},
{
    id: 254,
    question: "Combien de points vaut un essai transformé au rugby à XV ?",
    options: ["5", "6", "7", "8"],
    answer: 2
},
{
    id: 255,
    question: "Quel sportif détient le record du monde masculin du 100 mètres depuis 2009 ?",
    options: ["Carl Lewis", "Usain Bolt", "Justin Gatlin", "Yohan Blake"],
    answer: 1
},
{
    id: 256,
    question: "Quel protocole permet de traduire un nom de domaine en adresse IP ?",
    options: ["HTTP", "DNS", "FTP", "SSH"],
    answer: 1
},
{
    id: 257,
    question: "Que signifie l'abréviation VPN ?",
    options: ["Virtual Private Network", "Visual Public Network", "Verified Personal Node", "Virtual Protected Number"],
    answer: 0
},
{
    id: 258,
    question: "Quelle attaque consiste à tromper une personne afin d'obtenir des informations confidentielles ?",
    options: ["Le phishing", "Le chiffrement", "La sauvegarde", "La compression"],
    answer: 0
},
{
    id: 259,
    question: "Quel format d'image permet généralement de gérer la transparence ?",
    options: ["JPEG", "PNG", "BMP", "TIFF uniquement"],
    answer: 1
},
{
    id: 260,
    question: "Quel langage est principalement utilisé pour structurer une page web ?",
    options: ["CSS", "HTML", "SQL", "PHP"],
    answer: 1
},
{
    id: 261,
    question: "Quel océan est le plus profond du monde ?",
    options: ["L'océan Atlantique", "L'océan Indien", "L'océan Pacifique", "L'océan Arctique"],
    answer: 2
},
{
    id: 262,
    question: "Quel pays compte le plus grand nombre de fuseaux horaires en incluant ses territoires ?",
    options: ["La Russie", "Les États-Unis", "La France", "Le Canada"],
    answer: 2
},
{
    id: 263,
    question: "Quelle mer est réputée pour sa très forte salinité ?",
    options: ["La mer Noire", "La mer Morte", "La mer Baltique", "La mer d'Arabie"],
    answer: 1
},
{
    id: 264,
    question: "Quel pays est surnommé la terre du Milieu de feu et de glace ?",
    options: ["L'Islande", "La Nouvelle-Zélande", "L'Irlande", "La Finlande"],
    answer: 0
},
{
    id: 265,
    question: "Quel désert est le plus vaste désert chaud du monde ?",
    options: ["Le Gobi", "Le Sahara", "L'Atacama", "Le Kalahari"],
    answer: 1
},
{
    id: 266,
    question: "Quel philosophe grec fut le maître d'Alexandre le Grand ?",
    options: ["Socrate", "Platon", "Aristote", "Épicure"],
    answer: 2
},
{
    id: 267,
    question: "Quel philosophe a écrit Le Contrat social ?",
    options: ["Voltaire", "Jean-Jacques Rousseau", "Denis Diderot", "Montesquieu"],
    answer: 1
},
{
    id: 268,
    question: "Qui a écrit L'Esprit des lois ?",
    options: ["Montesquieu", "Rousseau", "Voltaire", "Descartes"],
    answer: 0
},
{
    id: 269,
    question: "Quelle œuvre est attribuée à Nicolas Machiavel ?",
    options: ["Le Prince", "L'Utopie", "Du contrat social", "La République"],
    answer: 0
},
{
    id: 270,
    question: "Quel penseur est connu pour la phrase « Je pense, donc je suis » ?",
    options: ["René Descartes", "Blaise Pascal", "Emmanuel Kant", "Baruch Spinoza"],
    answer: 0
},
{
    id: 271,
    question: "Quel métal a le symbole chimique W ?",
    options: ["Le tungstène", "Le titane", "Le zinc", "Le platine"],
    answer: 0
},
{
    id: 272,
    question: "Quel est le nom scientifique de l'être humain moderne ?",
    options: ["Homo erectus", "Homo habilis", "Homo sapiens", "Homo neanderthalensis"],
    answer: 2
},
{
    id: 273,
    question: "Quelle structure cellulaire contient principalement l'ADN chez les eucaryotes ?",
    options: ["Le noyau", "La membrane", "Le cytoplasme", "La mitochondrie"],
    answer: 0
},
{
    id: 274,
    question: "Quelle unité mesure la fréquence ?",
    options: ["Le watt", "Le volt", "Le hertz", "Le pascal"],
    answer: 2
},
{
    id: 275,
    question: "Quel phénomène explique la séparation de la lumière blanche en plusieurs couleurs ?",
    options: ["La réfraction", "La dispersion", "La diffraction", "La réflexion"],
    answer: 1
},
    {
    id: 276,
    question: "Quelle est la capitale de la Slovénie ?",
    options: ["Zagreb", "Ljubljana", "Bratislava", "Sofia"],
    answer: 1
},
{
    id: 277,
    question: "Quel pays possède l'enclave de Cabinda ?",
    options: ["L'Angola", "Le Gabon", "Le Congo", "La Namibie"],
    answer: 0
},
{
    id: 278,
    question: "Quel fleuve se jette dans la mer Caspienne ?",
    options: ["Le Danube", "La Volga", "Le Rhin", "Le Dniepr"],
    answer: 1
},
{
    id: 279,
    question: "Quel pays a pour capitale Naypyidaw ?",
    options: ["Le Laos", "Le Myanmar", "Le Cambodge", "Le Vietnam"],
    answer: 1
},
{
    id: 280,
    question: "Dans quel pays se situe la région de Transylvanie ?",
    options: ["La Hongrie", "La Roumanie", "La Bulgarie", "La Serbie"],
    answer: 1
},
{
    id: 281,
    question: "Quel événement est généralement considéré comme le début du Moyen Âge en Europe occidentale ?",
    options: ["La chute de l'Empire romain d'Occident", "La découverte de l'Amérique", "La Révolution française", "La bataille de Waterloo"],
    answer: 0
},
{
    id: 282,
    question: "Quel souverain français a été canonisé sous le nom de Saint Louis ?",
    options: ["Louis IX", "Louis XI", "Louis XIII", "Louis XV"],
    answer: 0
},
{
    id: 283,
    question: "Quelle ville fut la capitale de l'Empire byzantin ?",
    options: ["Athènes", "Rome", "Constantinople", "Alexandrie"],
    answer: 2
},
{
    id: 284,
    question: "Quel pays a vendu l'Alaska aux États-Unis en 1867 ?",
    options: ["Le Canada", "La Russie", "La France", "Le Royaume-Uni"],
    answer: 1
},
{
    id: 285,
    question: "Quel empire était dirigé par Moctezuma II lors de l'arrivée des Espagnols ?",
    options: ["L'empire inca", "L'empire aztèque", "L'empire maya", "L'empire ottoman"],
    answer: 1
},
{
    id: 286,
    question: "Quel scientifique a énoncé les trois lois du mouvement ?",
    options: ["Isaac Newton", "Galilée", "Albert Einstein", "Johannes Kepler"],
    answer: 0
},
{
    id: 287,
    question: "Quel est le pH approximatif d'une solution neutre à 25 °C ?",
    options: ["0", "5", "7", "14"],
    answer: 2
},
{
    id: 288,
    question: "Quelle planète possède le plus grand nombre de lunes connues parmi les propositions ?",
    options: ["Mercure", "Mars", "Jupiter", "Vénus"],
    answer: 2
},
{
    id: 289,
    question: "Quel type de rayonnement est constitué de noyaux d'hélium ?",
    options: ["Alpha", "Bêta", "Gamma", "Infrarouge"],
    answer: 0
},
{
    id: 290,
    question: "Quelle molécule transporte principalement l'oxygène dans le sang ?",
    options: ["L'insuline", "L'hémoglobine", "L'adrénaline", "La kératine"],
    answer: 1
},
{
    id: 291,
    question: "Quel auteur a écrit Le Procès ?",
    options: ["Franz Kafka", "Thomas Mann", "Hermann Hesse", "Stefan Zweig"],
    answer: 0
},
{
    id: 292,
    question: "Qui a écrit le roman Don Quichotte ?",
    options: ["Federico García Lorca", "Miguel de Cervantes", "Lope de Vega", "Gabriel García Márquez"],
    answer: 1
},
{
    id: 293,
    question: "Quel peintre néerlandais a réalisé La Jeune Fille à la perle ?",
    options: ["Rembrandt", "Johannes Vermeer", "Vincent van Gogh", "Piet Mondrian"],
    answer: 1
},
{
    id: 294,
    question: "Quel artiste a peint Les Nymphéas ?",
    options: ["Claude Monet", "Auguste Renoir", "Edgar Degas", "Camille Pissarro"],
    answer: 0
},
{
    id: 295,
    question: "Quel dramaturge a écrit En attendant Godot ?",
    options: ["Eugène Ionesco", "Samuel Beckett", "Jean-Paul Sartre", "Jean Anouilh"],
    answer: 1
},
{
    id: 296,
    question: "Quel est le logarithme décimal de 1 000 ?",
    options: ["1", "2", "3", "10"],
    answer: 2
},
{
    id: 297,
    question: "Quelle est la dérivée de x² ?",
    options: ["x", "2x", "x²", "2"],
    answer: 1
},
{
    id: 298,
    question: "Quelle est la valeur approximative de π à deux décimales ?",
    options: ["2,14", "3,14", "3,41", "4,13"],
    answer: 1
},
{
    id: 299,
    question: "Quel est le seul nombre premier pair ?",
    options: ["0", "1", "2", "4"],
    answer: 2
},
{
    id: 300,
    question: "Dans un triangle rectangle, quel théorème relie les longueurs des côtés ?",
    options: ["Le théorème de Thalès", "Le théorème de Pythagore", "Le théorème de Gauss", "Le théorème d'Euclide"],
    answer: 1
},
{
    id: 301,
    question: "Quel pays a accueilli les premiers Jeux olympiques modernes en 1896 ?",
    options: ["La France", "La Grèce", "Le Royaume-Uni", "Les États-Unis"],
    answer: 1
},
{
    id: 302,
    question: "Quel sport est associé au trophée de la Coupe Davis ?",
    options: ["Le tennis", "Le golf", "Le rugby", "Le hockey"],
    answer: 0
},
{
    id: 303,
    question: "Combien de trous compte un parcours de golf standard ?",
    options: ["9", "12", "18", "24"],
    answer: 2
},
{
    id: 304,
    question: "Quel pays a remporté la Coupe du monde de football en 1998 ?",
    options: ["Brésil", "France", "Italie", "Allemagne"],
    answer: 1
},
{
    id: 305,
    question: "Quel sport olympique combine ski de fond et tir à la carabine ?",
    options: ["Le biathlon", "Le combiné nordique", "Le snowboard", "Le curling"],
    answer: 0
},
{
    id: 306,
    question: "Quel protocole est principalement utilisé pour envoyer des e-mails ?",
    options: ["SMTP", "HTTP", "DNS", "SSH"],
    answer: 0
},
{
    id: 307,
    question: "Que signifie SQL en informatique ?",
    options: ["Structured Query Language", "Secure Question Link", "System Quality Layer", "Standard Quick Login"],
    answer: 0
},
{
    id: 308,
    question: "Quelle mesure permet de réduire le risque lié au vol d'un mot de passe ?",
    options: ["Utiliser le même mot de passe partout", "Activer l'authentification multifacteur", "Partager son mot de passe", "Désactiver les mises à jour"],
    answer: 1
},
{
    id: 309,
    question: "Quel type de chiffrement utilise une clé publique et une clé privée ?",
    options: ["Le chiffrement symétrique", "Le chiffrement asymétrique", "Le hachage", "La compression"],
    answer: 1
},
{
    id: 310,
    question: "Quel protocole permet généralement un accès distant chiffré à un serveur ?",
    options: ["Telnet", "SSH", "FTP", "HTTP"],
    answer: 1
},
{
    id: 311,
    question: "Quelle est la plus grande lune de Saturne ?",
    options: ["Europe", "Titan", "Io", "Triton"],
    answer: 1
},
{
    id: 312,
    question: "Quel astronome a formulé les lois du mouvement des planètes ?",
    options: ["Johannes Kepler", "Nicolas Copernic", "Edwin Hubble", "Tycho Brahe"],
    answer: 0
},
{
    id: 313,
    question: "Quelle planète est connue pour sa rotation rétrograde très lente ?",
    options: ["Mars", "Vénus", "Jupiter", "Neptune"],
    answer: 1
},
{
    id: 314,
    question: "Quelle unité est utilisée pour mesurer l'intensité électrique ?",
    options: ["Le volt", "L'ampère", "L'ohm", "Le watt"],
    answer: 1
},
{
    id: 315,
    question: "Quelle unité mesure la résistance électrique ?",
    options: ["Le joule", "Le volt", "L'ohm", "Le newton"],
    answer: 2
},
{
    id: 316,
    question: "Quel artiste a sculpté Le Penseur ?",
    options: ["Auguste Rodin", "Constantin Brancusi", "Alberto Giacometti", "Antoine Bourdelle"],
    answer: 0
},
{
    id: 317,
    question: "Quel roman de Mary Shelley met en scène une créature créée par un scientifique ?",
    options: ["Dracula", "Frankenstein", "L'Étrange Cas du docteur Jekyll", "Le Fantôme de l'Opéra"],
    answer: 1
},
{
    id: 318,
    question: "Quel écrivain a créé le détective Hercule Poirot ?",
    options: ["Agatha Christie", "Arthur Conan Doyle", "Georges Simenon", "Ian Fleming"],
    answer: 0
},
{
    id: 319,
    question: "Quel mouvement littéraire français est associé à Émile Zola ?",
    options: ["Le romantisme", "Le naturalisme", "Le symbolisme", "Le surréalisme"],
    answer: 1
},
{
    id: 320,
    question: "Quel opéra de Bizet met en scène une cigarière de Séville ?",
    options: ["Carmen", "La Traviata", "Aïda", "Tosca"],
    answer: 0
},
{
    id: 321,
    question: "Quelle est la monnaie officielle de la Hongrie ?",
    options: ["Le zloty", "Le forint", "La couronne", "Le leu"],
    answer: 1
},
{
    id: 322,
    question: "Quel pays a pour monnaie le zloty ?",
    options: ["La Pologne", "La Tchéquie", "La Slovaquie", "La Croatie"],
    answer: 0
},
{
    id: 323,
    question: "Quel État américain est surnommé le Golden State ?",
    options: ["Le Texas", "La Californie", "La Floride", "L'Arizona"],
    answer: 1
},
{
    id: 324,
    question: "Quel pays est traversé par le canal de Panama ?",
    options: ["Le Mexique", "Le Panama", "La Colombie", "Le Costa Rica"],
    answer: 1
},
{
    id: 325,
    question: "Quel pays possède la plus grande superficie d'Amérique du Sud ?",
    options: ["L'Argentine", "Le Pérou", "Le Brésil", "La Colombie"],
    answer: 2
},
];

/* Éléments HTML */
const pseudoScreen = document.getElementById("pseudo-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const pseudoForm = document.getElementById("pseudo-form");
const pseudoInput = document.getElementById("pseudo");
const pseudoError = document.getElementById("pseudo-error");

const quizForm = document.getElementById("quiz-form");
const quizError = document.getElementById("quiz-error");
const questionsContainer = document.getElementById("questions-container");

const playerName = document.getElementById("player-name");
const quizDateElement = document.getElementById("quiz-date");

const resultName = document.getElementById("result-name");
const resultScore = document.getElementById("result-score");

const correctionsContainer = document.getElementById("corrections-container");
const leaderboard = document.getElementById("leaderboard");
const leaderboardStatus = document.getElementById("leaderboard-status");

let dailyQuestions = [];

/* Retourne la date locale : AAAA-MM-JJ */
function getTodayKey() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* Date française lisible */
function getFrenchDate() {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date());
}

/* Crée une valeur stable à partir de la date */
function hashString(value) {
    let hash = 0;

    for (let index = 0; index < value.length; index++) {
        hash = ((hash << 5) - hash) + value.charCodeAt(index);
        hash |= 0;
    }

    return hash;
}

/* Mélange stable : mêmes questions pour tous durant la journée */
function seededShuffle(items, seed) {
    const shuffled = [...items];
    let currentSeed = seed;

    function random() {
        currentSeed |= 0;
        currentSeed = currentSeed + 0x6D2B79F5 | 0;

        let value = Math.imul(currentSeed ^ currentSeed >>> 15, 1 | currentSeed);
        value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;

        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    }

    for (let index = shuffled.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(random() * (index + 1));

        [shuffled[index], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[index]
        ];
    }

    return shuffled;
}

function getDailyQuestions() {
    const seed = hashString(getTodayKey());

    return seededShuffle(questionsBank, seed).slice(0, 10);
}

function showScreen(screen) {
    pseudoScreen.classList.add("d-none");
    quizScreen.classList.add("d-none");
    resultScreen.classList.add("d-none");

    screen.classList.remove("d-none");
}

function showError(element, message) {
    element.textContent = message;
    element.classList.remove("d-none");
}

function hideError(element) {
    element.textContent = "";
    element.classList.add("d-none");
}

function getPseudo() {
    return localStorage.getItem("quizPseudo") || "";
}

function setPseudo(pseudo) {
    localStorage.setItem("quizPseudo", pseudo);
}

function getResultForToday() {
    const savedDate = localStorage.getItem("quizCompletedDate");

    if (savedDate !== getTodayKey()) {
        return null;
    }

    const score = localStorage.getItem("quizScore");
    const answers = localStorage.getItem("quizAnswers");

    if (score === null || answers === null) {
        return null;
    }

    try {
        return {
            score: Number(score),
            answers: JSON.parse(answers)
        };
    } catch {
        return null;
    }
}

function saveResult(score, answers) {
    localStorage.setItem("quizCompletedDate", getTodayKey());
    localStorage.setItem("quizScore", String(score));
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
}

function renderQuestions() {
    questionsContainer.replaceChildren();

    dailyQuestions.forEach((question, questionIndex) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "card question-card mb-4";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const legend = document.createElement("legend");
        legend.className = "h5 mb-3";
        legend.textContent = `Question ${questionIndex + 1} : ${question.question}`;

        cardBody.appendChild(legend);

        question.options.forEach((option, optionIndex) => {
            const wrapper = document.createElement("div");
            wrapper.className = "form-check mb-2";

            const input = document.createElement("input");
            input.className = "form-check-input";
            input.type = "radio";
            input.name = `question-${question.id}`;
            input.id = `question-${question.id}-option-${optionIndex}`;
            input.value = String(optionIndex);
            input.required = true;

            const label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = input.id;
            label.textContent = option;

            wrapper.appendChild(input);
            wrapper.appendChild(label);
            cardBody.appendChild(wrapper);
        });

        fieldset.appendChild(cardBody);
        questionsContainer.appendChild(fieldset);
    });
}

function renderCorrections(answers) {
    correctionsContainer.replaceChildren();

    dailyQuestions.forEach((question, index) => {
        const selectedIndex = Number(answers[question.id]);
        const isCorrect = selectedIndex === question.answer;

        const card = document.createElement("article");
        card.className = `card correction-card mb-3 ${isCorrect ? "correct" : "incorrect"}`;

        const body = document.createElement("div");
        body.className = "card-body";

        const title = document.createElement("h3");
        title.className = "h5";
        title.textContent = `Question ${index + 1} : ${question.question}`;

        const selected = document.createElement("p");
        selected.className = isCorrect
            ? "answer-correct mb-2"
            : "answer-incorrect mb-2";

        selected.textContent = `Votre réponse : ${question.options[selectedIndex]}`;

        const correct = document.createElement("p");
        correct.className = "mb-0";

        const strong = document.createElement("strong");
        strong.textContent = "Bonne réponse : ";

        correct.appendChild(strong);
        correct.append(question.options[question.answer]);

        body.appendChild(title);
        body.appendChild(selected);
        body.appendChild(correct);

        card.appendChild(body);
        correctionsContainer.appendChild(card);
    });
}

async function getFirebaseUser() {
    if (auth.currentUser) {
        return auth.currentUser;
    }

    const credential = await signInAnonymously(auth);
    return credential.user;
}

async function saveScoreToFirebase(score) {
    try {
        const user = await getFirebaseUser();

        const scoreReference = doc(
            db,
            "dailyScores",
            getTodayKey(),
            "entries",
            user.uid
        );

        await setDoc(scoreReference, {
            uid: user.uid,
            pseudo: getPseudo(),
            score: score,
            completedAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Enregistrement Firebase indisponible :", error);
    }
}

async function loadLeaderboard() {
    leaderboard.replaceChildren();
    leaderboardStatus.textContent = "Chargement du classement…";

    try {
        const scoresReference = collection(
            db,
            "dailyScores",
            getTodayKey(),
            "entries"
        );

        const scoresQuery = query(
            scoresReference,
            orderBy("score", "desc"),
            limit(20)
        );

        const snapshot = await getDocs(scoresQuery);

        if (snapshot.empty) {
            leaderboardStatus.textContent = "Aucun score enregistré pour le moment.";
            return;
        }

        leaderboardStatus.textContent = "Les 20 meilleurs scores du jour.";

        snapshot.forEach((scoreDocument) => {
            const data = scoreDocument.data();

            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center";

            const pseudo = document.createElement("span");
            pseudo.textContent = data.pseudo || "Anonyme";

            const score = document.createElement("strong");
            score.textContent = `${data.score}/10`;

            item.appendChild(pseudo);
            item.appendChild(score);

            leaderboard.appendChild(item);
        });

    } catch (error) {
        console.error("Classement Firebase indisponible :", error);
        leaderboardStatus.textContent = "Le classement est momentanément indisponible.";
    }
}

function showQuiz() {
    const pseudo = getPseudo();

    if (!pseudo) {
        showScreen(pseudoScreen);
        pseudoInput.focus();
        return;
    }

    const previousResult = getResultForToday();

    if (previousResult !== null) {
        showResult(previousResult.score, previousResult.answers);
        return;
    }

    playerName.textContent = pseudo;
    quizDateElement.textContent = getFrenchDate();

    dailyQuestions = getDailyQuestions();
    renderQuestions();

    hideError(quizError);
    showScreen(quizScreen);
}

function showResult(score, answers) {
    resultName.textContent = getPseudo();
    resultScore.textContent = String(score);

    dailyQuestions = getDailyQuestions();
    renderCorrections(answers);

    showScreen(resultScreen);
    loadLeaderboard();
}

/* Validation et enregistrement du pseudo */
pseudoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const pseudo = pseudoInput.value.trim();

    if (!/^[\p{L}\p{N} _-]{2,30}$/u.test(pseudo)) {
        showError(
            pseudoError,
            "Le pseudo doit contenir entre 2 et 30 caractères."
        );
        return;
    }

    setPseudo(pseudo);
    hideError(pseudoError);
    showQuiz();
});

/* Calcul du score et affichage de la correction */
quizForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(quizForm);
    const answers = {};
    let score = 0;

    for (const question of dailyQuestions) {
        const answer = formData.get(`question-${question.id}`);

        if (answer === null) {
            showError(quizError, "Veuillez répondre aux 10 questions.");
            return;
        }

        answers[question.id] = Number(answer);

        if (Number(answer) === question.answer) {
            score++;
        }
    }

    saveResult(score, answers);

    await saveScoreToFirebase(score);

    showResult(score, answers);
});

function changePseudo() {
    localStorage.removeItem("quizPseudo");

    /*
     * Supprime également le résultat local.
     * Le classement Firebase déjà enregistré reste intact.
     */
    localStorage.removeItem("quizCompletedDate");
    localStorage.removeItem("quizScore");
    localStorage.removeItem("quizAnswers");

    pseudoInput.value = "";

    hideError(pseudoError);
    showScreen(pseudoScreen);

    pseudoInput.focus();
}

document.getElementById("change-pseudo").addEventListener("click", changePseudo);
document.getElementById("result-change-pseudo").addEventListener("click", changePseudo);

/* Démarrage */
showQuiz();

