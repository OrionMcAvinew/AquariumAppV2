import { Coral } from '../types';

export const CORAL_DATABASE: Coral[] = [
  // ── Soft Corals ──────────────────────────────────────────────────────────
  {
    id: 'toadstool-leather',
    name: 'Toadstool Leather',
    scientificName: 'Sarcophyton trocheliophorum',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'A large, mushroom-shaped soft coral with a tan-to-brown stalk topped by a ruffled cap bearing short polyps. One of the hardiest corals available and an excellent starter choice.',
    careNotes:
      'Tolerates moderate swings in salinity and lighting. May periodically shrink and shed a waxy coat — this is normal. Keep away from stony corals as its toxins can inhibit their growth.',
    emoji: '🍄',
  },
  {
    id: 'kenya-tree',
    name: 'Kenya Tree Coral',
    scientificName: 'Capnella imbricata',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'low',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'peaceful',
    description:
      'A branching soft coral that resembles a miniature tree, colored cream to tan. Very hardy and fast-growing, often producing small offshoots that detach and settle elsewhere.',
    careNotes:
      'Nearly indestructible — tolerates low light and variable flow. Fragging is easy: cut a branch and wedge it into rock rubble. Can outcompete other corals for space, so prune regularly.',
    emoji: '🌳',
  },
  {
    id: 'pulsing-xenia',
    name: 'Pulsing Xenia',
    scientificName: 'Xenia elongata',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Famous for its rhythmic pulsing motion, Xenia forms dense colonies of white to pink stalks topped by feathery eight-armed polyps. Its constant movement brings life to any reef.',
    careNotes:
      'Thrives in stable, high-pH water. Can spread rapidly — mount it on an isolated rock so it cannot crawl onto other corals. Iodine levels affect pulse rate. Will crash if water quality deteriorates.',
    emoji: '🌸',
  },
  {
    id: 'green-star-polyps',
    name: 'Green Star Polyps',
    scientificName: 'Briareum sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Bright green polyps emerge from a thin purple-to-maroon mat that spreads rapidly over rock surfaces. Under actinic lighting the fluorescence is striking.',
    careNotes:
      'One of the most beginner-friendly corals. Will cover entire rocks if unchecked — consider mounting on a dedicated island rock. Polyps retract at night and in response to stress.',
    emoji: '✳️',
  },
  {
    id: 'discosoma-mushroom',
    name: 'Discosoma Mushroom',
    scientificName: 'Discosoma sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'low',
    flowRequirement: 'low',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Flat to cupped disc-shaped polyps in a dazzling array of colors — blues, reds, greens, and purples. Reproduces readily by dropping small pieces that re-attach nearby.',
    careNotes:
      'Tolerates lower light than almost any other coral, perfect for shaded spots. Avoid strong flow which can prevent full expansion. May sting adjacent corals with sweeper tentacles at night.',
    emoji: '🫧',
  },
  // ── LPS Corals ───────────────────────────────────────────────────────────
  {
    id: 'hammer-coral',
    name: 'Hammer Coral',
    scientificName: 'Euphyllia ancora',
    coralType: 'lps',
    difficulty: 'intermediate',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Named for its distinctive hammer- or anchor-shaped polyp tips, this LPS sways gracefully in the current in shades of green, gold, and tan. A reef tank classic.',
    careNotes:
      'Requires moderate, indirect flow; strong direct flow damages tissue. Allow at least 6 inches clearance from other corals — sweeper tentacles extend up to 6 inches at night. Target feed meaty foods 1–2× per week.',
    emoji: '🔨',
  },
  {
    id: 'torch-coral',
    name: 'Torch Coral',
    scientificName: 'Euphyllia glabrescens',
    coralType: 'lps',
    difficulty: 'intermediate',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'aggressive',
    description:
      'Long flowing tentacles tipped with rounded balls give this coral a torch-like appearance. Colors range from tan and gold to vivid green and pink morphs.',
    careNotes:
      'Highly aggressive — long sweeper tentacles can damage or kill neighbors. Give ample space. Sensitive to rapid flow changes and temperature swings. Feed meaty foods 1–2× per week.',
    emoji: '🔦',
  },
  {
    id: 'frogspawn-coral',
    name: 'Frogspawn Coral',
    scientificName: 'Euphyllia divisa',
    coralType: 'lps',
    difficulty: 'intermediate',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Bubble-tipped branching polyps that resemble a cluster of frog eggs. Colors include green, tan, and pink. A classic reef centerpiece coral.',
    careNotes:
      'Compatible with other Euphyllia (hammer, torch) but will sting most other species. Prefers indirect, moderate flow. Weekly feeding with mysis shrimp improves growth.',
    emoji: '🐸',
  },
  {
    id: 'open-brain-coral',
    name: 'Open Brain Coral',
    scientificName: 'Trachyphyllia geoffroyi',
    coralType: 'lps',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'low',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'A free-living LPS that rests on the sandbed, displaying bold colors — red, green, pink, and multicolor morphs are common. Fluffy during the day when polyps fully expand.',
    careNotes:
      'Place directly on the sandbed — never on rock, as this can damage tissue. Low to no direct flow is ideal. Target feed meaty foods 1–2× per week; it will visibly inflate after eating.',
    emoji: '🧠',
  },
  {
    id: 'duncan-coral',
    name: 'Duncan Coral',
    scientificName: 'Duncanopsammia axifuga',
    coralType: 'lps',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'peaceful',
    description:
      'Columnar branches each topped by a single large, distinctly patterned polyp in shades of green and brown. Colonies branch over time into impressive structures.',
    careNotes:
      'One of the easiest LPS corals. Tolerates variable lighting and moderate flow. Responds enthusiastically to target feeding — rapidly extends polyps when food is detected in the water column.',
    emoji: '🌼',
  },
  {
    id: 'candy-cane-coral',
    name: 'Candy Cane Coral',
    scientificName: 'Caulastrea furcata',
    coralType: 'lps',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'peaceful',
    description:
      'Dome-shaped colonies of large colorful polyps striped in green, teal, and tan — reminiscent of candy canes. A very popular beginner reef coral.',
    careNotes:
      'Exceptionally hardy for an LPS. Tolerates higher nitrates than most stony corals. Feeds readily; weekly target feeding with mysis or cyclopeeze speeds growth significantly.',
    emoji: '🍬',
  },
  {
    id: 'elegance-coral',
    name: 'Elegance Coral',
    scientificName: 'Catalaphyllia jardinei',
    coralType: 'lps',
    difficulty: 'intermediate',
    lightRequirement: 'medium',
    flowRequirement: 'low',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Long, flowing tentacles tipped in green, pink, or cream make this LPS one of the most elegant corals in the hobby. Polyps are large and visually stunning.',
    careNotes:
      'Prefers the sandbed with low indirect flow. Sensitive to "elegance coral syndrome" — place away from other corals and avoid sharp rock edges. Regular feeding greatly improves long-term health.',
    emoji: '🌺',
  },
  {
    id: 'ricordea-florida',
    name: 'Ricordea Florida',
    scientificName: 'Ricordea florida',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'low',
    placement: 'bottom',
    aggressiveness: 'peaceful',
    description:
      'A colorful mushroom coral covered in tiny bubble-like vesicles (vesicular tentacles) in stunning greens, oranges, purples, and multicolor morphs. Highly prized by collectors.',
    careNotes:
      'One of the most colorful soft corals available. Tolerates low light but shows best color under moderate lighting. Dislikes strong direct flow. Reproduces by splitting — a healthy specimen will slowly multiply.',
    emoji: '🟢',
  },
  {
    id: 'palythoa',
    name: 'Palythoa / Zoa',
    scientificName: 'Palythoa grandis',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Colonial polyps that form dense mats across rock surfaces, available in an astonishing variety of color morphs. Among the most traded and collected corals in the reef hobby.',
    careNotes:
      'CAUTION: Palythoa contain palytoxin — wear gloves and eye protection when handling and never heat or cut dry. Hardy and fast-spreading once established. Excellent starter coral for reef color.',
    emoji: '🌈',
  },
  {
    id: 'devil-finger',
    name: "Devil's Hand Leather",
    scientificName: 'Lobophytum crassum',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'A large lobed leather coral with finger-like projections that give it a hand-like silhouette. Tan to cream colored with short polyp extensions.',
    careNotes:
      'Very hardy and tolerant. Like other leathers, periodically sheds a waxy coat and retracts for a day or two — completely normal. Releases toxins that can inhibit LPS and SPS; run activated carbon when fragging.',
    emoji: '✋',
  },
  // ── LPS Corals (additional) ───────────────────────────────────────────────
  {
    id: 'blastomussa',
    name: 'Blastomussa',
    scientificName: 'Blastomussa wellsi',
    coralType: 'lps',
    difficulty: 'beginner',
    lightRequirement: 'low',
    flowRequirement: 'low',
    placement: 'bottom',
    aggressiveness: 'peaceful',
    description:
      'Large-polyped colonial coral with round, inflated heads in rich reds, greens, and multicolors. A very forgiving LPS that does well in lower-light parts of the tank.',
    careNotes:
      'One of the easiest LPS corals — tolerates a wide range of parameters. Perfect for lower-light placement. Target feed every 1–2 weeks for best growth. Will not sting neighbors aggressively.',
    emoji: '🔴',
  },
  {
    id: 'acan-lord',
    name: 'Acan Lord',
    scientificName: 'Acanthastrea lordhowensis',
    coralType: 'lps',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Encrusting colonial coral with boldly colored, fleshy polyps in virtually every color combination imaginable. Highly collectible — named morphs can command premium prices.',
    careNotes:
      'Hardy and adaptable. Benefits from regular target feeding with meaty foods (mysis, cyclopeeze). Expand slowly to higher light to avoid bleaching. Does not extend sweeper tentacles far so spacing requirements are modest.',
    emoji: '🎨',
  },
  {
    id: 'chalice-coral',
    name: 'Chalice Coral',
    scientificName: 'Echinophyllia aspera',
    coralType: 'lps',
    difficulty: 'intermediate',
    lightRequirement: 'medium',
    flowRequirement: 'low',
    placement: 'middle',
    aggressiveness: 'aggressive',
    description:
      'Plating LPS coral with a chalice or bowl-like growth form, available in spectacular multicolor morphs — often showing contrasting eye colors under blue lighting.',
    careNotes:
      'Aggressive — produces a sweeping "chalice burn" that can damage neighbors. Lower, indirect placement in the tank is ideal. Avoid high direct flow which can cause tissue recession. Monthly feeding boosts color.',
    emoji: '🏆',
  },
  {
    id: 'plate-coral',
    name: 'Short Tentacle Plate Coral',
    scientificName: 'Fungia sp.',
    coralType: 'lps',
    difficulty: 'intermediate',
    lightRequirement: 'medium',
    flowRequirement: 'low',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Free-living circular LPS coral with short, evenly spaced tentacles. One of the few corals capable of slowly moving across the sandbed using its tentacles.',
    careNotes:
      'Must be placed on the sandbed — never prop it on rock. If flipped over, it can right itself given time; assist if it appears distressed. Target feed weekly; it inflates noticeably after eating.',
    emoji: '🥏',
  },
  // ── SPS Corals ───────────────────────────────────────────────────────────
  {
    id: 'acropora-millepora',
    name: 'Acropora Millepora',
    scientificName: 'Acropora millepora',
    coralType: 'sps',
    difficulty: 'advanced',
    lightRequirement: 'very-high',
    flowRequirement: 'high',
    placement: 'top',
    aggressiveness: 'semi-aggressive',
    description:
      'A classic branching SPS forming compact, intricate colonies. Among the most colorful reef corals — morphs range from neon green and blue to orange and pink.',
    careNotes:
      'Demands pristine water: nitrate < 5 ppm, phosphate < 0.05 ppm. Requires intense lighting (PAR 250–400+) and vigorous random flow. Keep 76–78 °F. Dose calcium, alkalinity, and magnesium consistently.',
    emoji: '🌿',
  },
  {
    id: 'montipora-capricornis',
    name: 'Montipora Capricornis',
    scientificName: 'Montipora capricornis',
    coralType: 'sps',
    difficulty: 'intermediate',
    lightRequirement: 'high',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'peaceful',
    description:
      'A plating SPS that grows in flat, circular whorls resembling rose petals. Found in orange, red, green, and purple. Grows faster than most SPS corals.',
    careNotes:
      'A good entry-level SPS. Tolerates slightly higher nutrients than Acropora. PAR 150–300 is ideal. Ensure calcium and alkalinity are stable — growth rate is impressive once established.',
    emoji: '🌀',
  },
  {
    id: 'seriatopora',
    name: 'Birdsnest Coral',
    scientificName: 'Seriatopora hystrix',
    coralType: 'sps',
    difficulty: 'advanced',
    lightRequirement: 'very-high',
    flowRequirement: 'high',
    placement: 'top',
    aggressiveness: 'peaceful',
    description:
      'Extremely thin, needle-like branches create a delicate birdsnest appearance. Colors include pink, green, and purple. One of the fastest-growing branching SPS corals.',
    careNotes:
      'Very sensitive — fragile branches break easily. Requires high, chaotic (non-laminar) flow. Detritus settling on branches causes rapid tissue necrosis. Pristine water parameters are non-negotiable.',
    emoji: '🐦',
  },
  {
    id: 'stylophora',
    name: 'Stylophora',
    scientificName: 'Stylophora pistillata',
    coralType: 'sps',
    difficulty: 'intermediate',
    lightRequirement: 'high',
    flowRequirement: 'high',
    placement: 'top',
    aggressiveness: 'peaceful',
    description:
      'Compact, bushy branching SPS coral with blunt club-shaped branch tips. Often called "clubbed finger coral." Available in pink, green, purple, and yellow morphs.',
    careNotes:
      'One of the more forgiving branching SPS corals — a good entry point into keeping SPS. Tolerates slightly elevated nutrients compared to Acropora. Still requires stable alkalinity and calcium. High, varied flow is important.',
    emoji: '🌵',
  },
  {
    id: 'pocillopora',
    name: 'Cauliflower Coral',
    scientificName: 'Pocillopora damicornis',
    coralType: 'sps',
    difficulty: 'intermediate',
    lightRequirement: 'high',
    flowRequirement: 'high',
    placement: 'top',
    aggressiveness: 'peaceful',
    description:
      'Branching SPS with a cauliflower-like appearance — dense, rounded clumps of small branches. Often green, pink, or tan. A fast grower and common frag trade species.',
    careNotes:
      'Hardier than most SPS and a great first branching stony coral. Grows quickly under good conditions. Stable alkalinity (8–9 dKH) is critical for growth. Excellent indicator coral — bleaches early when conditions slip.',
    emoji: '🥦',
  },
];

export function getCoralById(id: string): Coral | undefined {
  return CORAL_DATABASE.find((c) => c.id === id);
}
