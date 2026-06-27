const CIVILISATION_LAYER_CONFIG = [
  { id: "mediterranean", label: "Mediterranean classics", colour: "#c57a2a", icon: "🏛️" },
  { id: "near-east", label: "Near East and empires", colour: "#9f6bff", icon: "🦁" },
  { id: "asia", label: "South and East Asia", colour: "#2f9e83", icon: "🛕" },
  { id: "africa", label: "Africa and Indian Ocean", colour: "#d85d5d", icon: "🌍" },
  { id: "americas", label: "Americas", colour: "#2d84c8", icon: "🗿" },
  { id: "northern-pacific", label: "Northern and Pacific worlds", colour: "#6f8f3a", icon: "🧭" },
  { id: "creative-tech", label: "Creative technology inspiration", colour: "#e04aa4", icon: "🎮" }
];

const RAW_CIVILISATION_SITES = [
  ["acropolis-athens", "Acropolis of Athens", "mediterranean", 23.726, 37.9715, "Classical Greece", "Greece", "5th century BCE", true, "Temple and civic hill", "Architecture, democracy, patron gods", "How can one hill become the memory of a city?"],
  ["delphi", "Delphi", "mediterranean", 22.501, 38.482, "Classical Greece", "Greece", "Archaic to Roman", true, "Oracle sanctuary", "Prophecy, consultation, landscape", "How did ancient people turn uncertainty into ritual?"],
  ["olympia", "Olympia", "mediterranean", 21.63, 37.638, "Classical Greece", "Greece", "8th century BCE onwards", true, "Athletic sanctuary", "Games, competition, truce", "Why did sport become sacred?"],
  ["mycenae", "Mycenae and Tiryns", "mediterranean", 22.756, 37.73, "Mycenaean Greece", "Greece", "2nd millennium BCE", true, "Bronze Age citadel", "Walls, kingship, epic memory", "What makes a fortress become a legend?"],
  ["knossos", "Knossos", "mediterranean", 25.163, 35.298, "Minoan Crete", "Greece", "2nd millennium BCE", false, "Palace complex", "Labyrinth stories, trade, frescoes", "How do archaeology and myth overlap?"],
  ["troy", "Troy", "mediterranean", 26.238, 39.957, "Anatolian and Aegean world", "Turkey", "Bronze Age to Roman", true, "Layered city", "Epic, archaeology, war memory", "How can one site hold many versions of history?"],
  ["ephesus", "Ephesus", "mediterranean", 27.341, 37.939, "Greek and Roman Asia Minor", "Turkey", "Classical to Byzantine", true, "Ancient city", "Library, theatre, trade routes", "What does a city reveal through its streets?"],
  ["pergamon", "Pergamon", "mediterranean", 27.18, 39.12, "Hellenistic world", "Turkey", "3rd to 2nd century BCE", true, "Hilltop city", "Libraries, medicine, royal power", "How does knowledge become political power?"],
  ["rome-colosseum", "Rome and the Colosseum", "mediterranean", 12.4922, 41.8902, "Ancient Rome", "Italy", "1st century CE", true, "Imperial city", "Engineering, spectacle, empire", "How did infrastructure help Rome project power?"],
  ["pompeii", "Pompeii", "mediterranean", 14.487, 40.748, "Roman world", "Italy", "1st century CE", true, "Buried city", "Daily life, disaster, preservation", "Why can destruction sometimes preserve evidence?"],
  ["carthage", "Carthage", "mediterranean", 10.329, 36.852, "Phoenician and Punic", "Tunisia", "1st millennium BCE", true, "Port city", "Trade, navy, Rome's rival", "How do sea routes build civilisations?"],
  ["giza", "Memphis and the Giza Pyramids", "near-east", 31.1342, 29.9792, "Ancient Egypt", "Egypt", "3rd millennium BCE", true, "Pyramid landscape", "Afterlife, geometry, state labour", "How does engineering become sacred architecture?"],
  ["karnak", "Karnak and Ancient Thebes", "near-east", 32.657, 25.718, "Ancient Egypt", "Egypt", "Middle Kingdom to Ptolemaic", true, "Temple city", "Ritual, columns, dynasties", "How does a sacred site grow over centuries?"],
  ["abu-simbel", "Abu Simbel", "near-east", 31.6258, 22.3372, "Ancient Egypt and Nubia", "Egypt", "13th century BCE", true, "Rock temples", "Kingship, solar alignment, rescue engineering", "How can ancient and modern engineering meet at one site?"],
  ["meroe", "Meroe", "africa", 33.729, 16.938, "Kingdom of Kush", "Sudan", "3rd century BCE onwards", true, "Pyramid cemetery and city", "Iron, African kingship, Nile networks", "What changes when Egypt is viewed from the south?"],
  ["babylon", "Babylon", "near-east", 44.42, 32.536, "Mesopotamia", "Iraq", "2nd to 1st millennium BCE", true, "Ancient city", "Law, astronomy, imperial myth", "How do cities become symbols beyond their walls?"],
  ["ur", "Ur", "near-east", 46.103, 30.962, "Sumer", "Iraq", "3rd millennium BCE", false, "Ziggurat city", "Writing, trade, temple economy", "How did writing change administration?"],
  ["persepolis", "Persepolis", "near-east", 52.891, 29.935, "Achaemenid Persia", "Iran", "6th to 4th century BCE", true, "Imperial terrace", "Processions, empire, stone reliefs", "How can art organise a multi-ethnic empire?"],
  ["petra", "Petra", "near-east", 35.444, 30.328, "Nabataean", "Jordan", "1st century BCE to CE", true, "Rock-cut city", "Water engineering, trade, desert routes", "How do people build abundance in dry places?"],
  ["palmyra", "Palmyra", "near-east", 38.267, 34.55, "Syrian oasis city", "Syria", "1st to 3rd century CE", true, "Oasis city", "Caravan trade, hybrid culture", "How do crossroads create new identities?"],
  ["hattusa", "Hattusa", "near-east", 34.619, 40.019, "Hittite", "Turkey", "2nd millennium BCE", true, "Capital city", "Archives, gates, empire", "What can a capital reveal about power?"],
  ["gobekli-tepe", "Gobekli Tepe", "near-east", 38.922, 37.223, "Prehistoric Anatolia", "Turkey", "10th to 8th millennium BCE", true, "Ritual enclosure", "Prehistory, monuments, symbols", "What if ritual helped organise settlement?"],
  ["mohenjo-daro", "Mohenjo-daro", "asia", 68.138, 27.329, "Indus Valley", "Pakistan", "3rd millennium BCE", true, "Urban archaeological site", "Drainage, planning, craft", "How does sanitation show civic intelligence?"],
  ["harappa", "Harappa", "asia", 72.866, 30.628, "Indus Valley", "Pakistan", "3rd millennium BCE", false, "Urban archaeological site", "Weights, streets, seals", "What can standardisation reveal about trade?"],
  ["taxila", "Taxila", "asia", 72.887, 33.746, "Gandhara", "Pakistan", "6th century BCE onwards", true, "Learning and urban complex", "Buddhist, Persian, Greek and Indian links", "How do crossroads become centres of learning?"],
  ["sanchi", "Sanchi", "asia", 77.739, 23.486, "Mauryan and Buddhist India", "India", "3rd century BCE onwards", true, "Stupa complex", "Buddhist art, pilgrimage, symbols", "How does a monument teach without words?"],
  ["nalanda", "Nalanda", "asia", 85.444, 25.136, "Ancient India", "India", "5th to 12th century CE", true, "Monastic university", "Study, libraries, international learning", "What makes a place a university before modern universities?"],
  ["angkor-wat", "Angkor Wat", "asia", 103.867, 13.412, "Khmer Empire", "Cambodia", "12th century CE", true, "Temple city", "Water, kingship, cosmology", "How can a city model a universe?"],
  ["borobudur", "Borobudur", "asia", 110.204, -7.607, "Sailendra Java", "Indonesia", "8th to 9th century CE", true, "Buddhist monument", "Pilgrimage path, reliefs, mandala", "How does movement through a monument become learning?"],
  ["bagan", "Bagan", "asia", 94.867, 21.171, "Pagan Kingdom", "Myanmar", "11th to 13th century CE", true, "Temple plain", "Thousands of monuments, devotion, landscape", "How does repetition create sacred geography?"],
  ["terracotta-army", "Mausoleum of the First Qin Emperor", "asia", 109.273, 34.384, "Qin China", "China", "3rd century BCE", true, "Imperial tomb complex", "Terracotta army, centralisation, afterlife", "How does a ruler stage power beyond death?"],
  ["great-wall", "Great Wall at Badaling", "asia", 116.016, 40.359, "Imperial China", "China", "Multiple dynasties", true, "Frontier defence", "Borders, labour, military logistics", "What does a wall reveal about fear and organisation?"],
  ["nara", "Historic Nara", "asia", 135.839, 34.685, "Classical Japan", "Japan", "8th century CE", true, "Capital temples", "Buddhism, court culture, urban planning", "How does a capital import and transform ideas?"],
  ["kyoto", "Historic Kyoto", "asia", 135.768, 35.011, "Classical Japan", "Japan", "8th century CE onwards", true, "Historic city", "Temples, gardens, craft, continuity", "How can a city preserve layers of memory?"],
  ["teotihuacan", "Teotihuacan", "americas", -98.833, 19.692, "Mesoamerica", "Mexico", "1st to 7th century CE", true, "Planned ancient city", "Pyramids, avenues, urban grid", "How does urban planning express cosmology?"],
  ["chichen-itza", "Chichen Itza", "americas", -88.568, 20.684, "Maya and Toltec worlds", "Mexico", "Late Classic to Postclassic", true, "Ceremonial city", "Astronomy, ball court, pyramid", "How do calendars become architecture?"],
  ["tikal", "Tikal", "americas", -89.623, 17.222, "Maya", "Guatemala", "Classic period", true, "Forest city", "Kingship, temples, ecology", "How can forests hide and preserve cities?"],
  ["palenque", "Palenque", "americas", -92.046, 17.484, "Maya", "Mexico", "Classic period", true, "Maya city", "Inscriptions, palace, dynasty", "How does writing give rulers a voice across time?"],
  ["machu-picchu", "Machu Picchu", "americas", -72.545, -13.163, "Inca", "Peru", "15th century CE", true, "Mountain estate", "Terraces, stonework, landscape", "How does architecture negotiate with mountains?"],
  ["cusco", "Cusco", "americas", -71.967, -13.532, "Inca", "Peru", "Inca and colonial layers", true, "Imperial capital", "Roads, stonework, sacred geography", "How does an empire organise space from a capital?"],
  ["chan-chan", "Chan Chan", "americas", -79.075, -8.111, "Chimu", "Peru", "9th to 15th century CE", true, "Adobe city", "Desert urbanism, walls, water", "How does material choice shape a city?"],
  ["nazca", "Nazca Lines", "americas", -75.133, -14.739, "Nazca", "Peru", "500 BCE to 500 CE", true, "Geoglyph landscape", "Lines, ritual, desert preservation", "How can drawings become geography?"],
  ["great-zimbabwe", "Great Zimbabwe", "africa", 30.934, -20.267, "Shona civilisation", "Zimbabwe", "11th to 15th century CE", true, "Stone city", "Trade, cattle, architecture", "How does stonework challenge outside assumptions?"],
  ["aksum", "Aksum", "africa", 38.722, 14.132, "Aksumite Empire", "Ethiopia", "1st millennium CE", true, "Obelisk and city site", "Trade, inscriptions, Christianity", "How did African kingdoms connect continents?"],
  ["lalibela", "Lalibela", "africa", 39.047, 12.031, "Medieval Ethiopia", "Ethiopia", "12th to 13th century CE", true, "Rock-hewn churches", "Pilgrimage, carving, sacred landscape", "How can subtraction from rock become architecture?"],
  ["timbuktu", "Timbuktu", "africa", -3.007, 16.773, "Mali and Songhai worlds", "Mali", "14th to 16th century CE", true, "Scholarly city", "Manuscripts, trade, Islam, learning", "How can books become infrastructure for civilisation?"],
  ["djenne", "Djenne", "africa", -4.555, 13.906, "West African Sahel", "Mali", "Medieval to modern", true, "Mud-brick city", "Architecture, trade, community renewal", "Why does maintenance matter in heritage?"],
  ["kilwa", "Kilwa Kisiwani", "africa", 39.533, -8.955, "Swahili Coast", "Tanzania", "13th to 16th century CE", true, "Island trading city", "Indian Ocean trade, coral stone, Islam", "How do oceans connect cities into networks?"],
  ["stonehenge", "Stonehenge", "northern-pacific", -1.826, 51.178, "Neolithic Britain", "United Kingdom", "3rd millennium BCE", true, "Stone circle", "Astronomy, ritual, landscape", "How do monuments measure time?"],
  ["newgrange", "Newgrange", "northern-pacific", -6.476, 53.694, "Neolithic Ireland", "Ireland", "4th millennium BCE", true, "Passage tomb", "Solstice alignment, ritual, engineering", "How can light become part of a building?"],
  ["hadrians-wall", "Hadrian's Wall", "northern-pacific", -2.3, 54.99, "Roman Britain", "United Kingdom", "2nd century CE", true, "Frontier wall", "Military logistics, empire, borderland", "What does a frontier reveal about empire?"],
  ["samarkand", "Samarkand", "near-east", 66.975, 39.654, "Silk Road", "Uzbekistan", "Ancient to Timurid", true, "Crossroads city", "Trade, astronomy, craft, learning", "How does exchange create beauty?"],
  ["bukhara", "Bukhara", "near-east", 64.43, 39.775, "Silk Road", "Uzbekistan", "Ancient to medieval", true, "Historic city", "Trade, scholarship, urban fabric", "Why do routes produce libraries and markets?"],
  ["mesa-verde", "Mesa Verde", "americas", -108.462, 37.23, "Ancestral Pueblo", "United States", "6th to 13th century CE", true, "Cliff dwellings", "Architecture, landscape, community", "How does building into cliffs change daily life?"],
  ["chaco-canyon", "Chaco Canyon", "americas", -107.956, 36.061, "Ancestral Pueblo", "United States", "9th to 12th century CE", true, "Ceremonial landscape", "Roads, astronomy, great houses", "How do roads and alignments create a regional system?"],
  ["rapa-nui", "Rapa Nui", "northern-pacific", -109.349, -27.112, "Rapa Nui", "Chile", "13th to 17th century CE", true, "Moai landscape", "Ancestors, statues, island systems", "How does isolation change the meaning of resources?"],
  ["nan-madol", "Nan Madol", "northern-pacific", 158.331, 6.844, "Saudeleur Dynasty", "Micronesia", "13th to 17th century CE", true, "Canal city", "Basalt architecture, lagoon, chiefs", "How do people build monumental spaces on water?"],
  ["nintendo-museum-uji", "Nintendo Museum, Uji", "creative-tech", 135.795, 34.892, "Modern creative culture", "Japan", "Opened 2024", false, "Game heritage museum", "Play, design, product history", "How can play become cultural memory?"],
  ["kyoto-creative-map", "Kyoto Creative Industries", "creative-tech", 135.768, 35.011, "Modern and classical Kyoto", "Japan", "Historic and modern", false, "Creative city marker", "Craft, games, animation, temples", "How can old cultural memory feed new creative technology?"],
  ["seattle-gaming-culture", "Seattle Gaming Culture", "creative-tech", -122.332, 47.606, "Modern creative technology", "United States", "Modern", false, "Creative technology city", "Software, games, education, design", "How do modern toolmakers create worlds for others to explore?"]
];

function buildCivilisationFeature(site) {
  const [id, name, layer, lon, lat, civilisation, country, period, unesco, siteType, focus, studentPrompt] = site;
  return {
    type: "Feature",
    id,
    geometry: {
      type: "Point",
      coordinates: [lon, lat]
    },
    properties: {
      id,
      name,
      layer,
      civilisation,
      country,
      period,
      unesco,
      siteType,
      focus,
      studentPrompt
    }
  };
}

window.CIVILISATION_LAYER_CONFIG = Object.freeze(CIVILISATION_LAYER_CONFIG);
window.CIVILISATION_GEOJSON = Object.freeze({
  type: "FeatureCollection",
  name: "YouEngineer global civilisation atlas starter layer",
  features: RAW_CIVILISATION_SITES.map(buildCivilisationFeature)
});
