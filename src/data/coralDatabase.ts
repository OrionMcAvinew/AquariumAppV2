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
  // ── Zoanthids / Palythoa morphs ──────────────────────────────────────────
  {
    id: 'zoa-rasta',
    name: 'Rasta Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Iconic zoa morph with a bright green center surrounded by red-and-orange tentacles — inspired by Rastafarian colors. One of the most recognizable named morphs in the hobby.',
    careNotes:
      'Very hardy and one of the fastest-spreading zoas. Tolerates a range of lighting from moderate to high. Separate from other zoa morphs you want to keep pure — they can overgrow neighbors. Palytoxin precautions apply.',
    emoji: '🟢',
  },
  {
    id: 'zoa-eagle-eye',
    name: 'Eagle Eye Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Striking morph with a vivid green skirt and a contrasting red or orange center eye. The bright color contrast makes them stand out under any lighting.',
    careNotes:
      'Hardy and fast-growing once established. Medium lighting brings out the best color contrast. Keep flow moderate — too much flow causes polyps to remain closed. Feed with reef roids or similar coral foods for faster spreading.',
    emoji: '👁️',
  },
  {
    id: 'zoa-utter-chaos',
    name: 'Utter Chaos Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'A kaleidoscopic morph featuring swirling patterns of pink, orange, and green — aptly named for its chaotic but beautiful coloration. A highly sought-after collector morph.',
    careNotes:
      'Grows at a moderate pace compared to simpler morphs. Stable water parameters preserve the vivid coloration. Under actinic lighting the fluorescence is spectacular. Worth keeping on an isolated frag plug to protect the morph.',
    emoji: '🌀',
  },
  {
    id: 'zoa-space-monster',
    name: 'Space Monster Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Large-polyped zoa with a teal-to-aqua body and contrasting purple or pink ring around a green center. One of the most vivid fluorescent morphs available.',
    careNotes:
      'Larger polyps than most zoas — they need a bit more space on the frag plug. Excellent color under actinic or blue-heavy lighting. Hardy once settled; new frags may stay closed for days before opening fully.',
    emoji: '👾',
  },
  {
    id: 'zoa-fruit-loops',
    name: 'Fruit Loops Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Multicolored morph with a yellow-to-orange center, pink skirt, and green tentacle tips — resembling the cereal of the same name. A bright, cheerful addition to any reef.',
    careNotes:
      'Fast spreader under good conditions. Colors are most vivid under moderate blue-heavy lighting. Occasional feeding with reef roids or oyster feast helps colonies spread quickly. Palytoxin precautions apply.',
    emoji: '🍭',
  },
  {
    id: 'zoa-sunny-ds',
    name: "Sunny D's Zoas",
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Bright orange-and-yellow zoa with a vivid yellow center that glows like a small sun in the tank. One of the most popular "warm-toned" named morphs.',
    careNotes:
      'Best color under higher lighting — will appear more muted under low par. Hardy and spreads at a steady pace. Keep iron, magnesium, and alkalinity stable for consistent coloration.',
    emoji: '☀️',
  },
  {
    id: 'zoa-king-midas',
    name: 'King Midas Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'All-gold zoa morph with rich yellow-to-orange coloring across the entire polyp. Named for the mythical king whose touch turned everything to gold.',
    careNotes:
      'Color is most saturated under moderate to high PAR. One of the faster-spreading gold morphs. Keep on a separate frag plug if you want to prevent it from overrunning other zoas.',
    emoji: '👑',
  },
  {
    id: 'zoa-people-eater',
    name: "People Eater Zoas",
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Dark purple-to-black skirt with a vivid green center and bright orange mouth. One of the most striking high-contrast zoa morphs in the hobby.',
    careNotes:
      'Slower grower than simpler morphs — patience pays off. Stable parameters and occasional feeding keep the color vivid. Highly sought-after; colonies command a premium so frag carefully.',
    emoji: '😈',
  },
  {
    id: 'zoa-gorilla-nipples',
    name: 'Gorilla Nipple Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Chunky, large-bodied zoa with a brownish-pink skirt and bright orange-red center. Named for their distinctive bumpy, rounded polyp shape.',
    careNotes:
      'Very hardy and fast-spreading. One of the most forgiving named morphs — tolerates a wider range of lighting and flow than premium morphs. Great gateway into the zoa collecting hobby.',
    emoji: '🦍',
  },
  {
    id: 'zoa-pink-panther',
    name: 'Pink Panther Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Soft pink to rose-colored polyps with a lighter pink or white center. Subtle and elegant compared to flashier morphs — popular for pastel-themed reef builds.',
    careNotes:
      'Moderate grower. Colors are best under blue-heavy or mixed lighting. Works well as a carpet zoa between more colorful morphs. Palytoxin precautions apply as with all zoas.',
    emoji: '🌸',
  },
  {
    id: 'zoa-armor-of-god',
    name: 'Armor of God Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Bold morph with a metallic blue-green skirt, orange ring, and green center. Under actinic lighting the metallic shimmer is extraordinary — a true showpiece morph.',
    careNotes:
      'Slower to spread than many morphs but worth the wait. High-quality water and stable parameters keep the metallic sheen vivid. Fragging produces premium trade value.',
    emoji: '🛡️',
  },
  {
    id: 'zoa-darth-maul',
    name: 'Darth Maul Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Red-and-black morph with a vivid blood-red skirt and contrasting dark center — directly inspired by the Star Wars villain. One of the most recognizable named morphs in the hobby.',
    careNotes:
      'Hardy and consistent spreader. Red pigmentation is most intense under moderate white-blue spectrum lighting. A popular morph for Star Wars-themed reef builds and new collectors alike.',
    emoji: '⚔️',
  },
  {
    id: 'zoa-nuclear-green',
    name: 'Nuclear Green Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Intensely fluorescent lime-green polyps that almost appear to glow under any lighting. One of the most eye-catching single-color morphs in the hobby.',
    careNotes:
      'Fast spreader — can carpet a rock quickly. Florescence is best under blue-heavy lighting. Very forgiving of parameter swings. A great "filler" zoa to add movement and color to empty rock.',
    emoji: '☢️',
  },
  {
    id: 'zoa-ice-torchys',
    name: "Ice Torch Zoas",
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Cool-toned morph with a pale blue-white skirt, icy blue ring, and white center — one of the few truly "cold" colored zoa morphs available.',
    careNotes:
      'Moderate grower. Blue and white tones are most vivid under blue-dominant spectrum. Avoid high nitrates which cause pigment loss. A popular choice for blue-themed reef builds.',
    emoji: '🧊',
  },
  {
    id: 'zoa-tubbs-blue',
    name: "Tubb's Blue Zoas",
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Deep royal-blue skirt with a contrasting lighter blue or white center. One of the most sought-after true-blue zoa morphs and a staple of collector tanks.',
    careNotes:
      'Tends to grow slower than green or brown morphs. Water clarity and low nutrients preserve the blue pigmentation. Often fragged and traded at premium; protect from faster-spreading neighbors.',
    emoji: '💙',
  },
  {
    id: 'zoa-whammin-watermelon',
    name: 'Whammin Watermelon Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Green-striped outer skirt with a pink-to-red center that mimics the colors of a watermelon. A fun, bold morph that is instantly recognizable.',
    careNotes:
      'Hardy and reliable spreader. The pink center is most vibrant under mixed white/blue lighting. One of the easier premium morphs to keep — a good starting point for named morph collecting.',
    emoji: '🍉',
  },
  {
    id: 'zoa-candy-apple-reds',
    name: 'Candy Apple Red Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Solid deep-red polyps with a slightly orange hue — like a lacquered candy apple. One of the richest red morphs available in the hobby.',
    careNotes:
      'Red pigments can fade under very high PAR — moderate lighting is ideal. Spreads at a medium pace. Visually pairs well with green morphs for high contrast. Palytoxin precautions apply.',
    emoji: '🍎',
  },
  {
    id: 'zoa-purple-monster',
    name: 'Purple Monster Zoas',
    scientificName: 'Zoanthus sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Rich purple skirt with a contrasting green center — a large-polyped morph that makes a dramatic statement in any reef tank.',
    careNotes:
      'Slower grower befitting its large polyp size. Purple color is most vibrant under mixed spectrum lighting. Feeds well on broadcast reef foods, which speeds colony growth noticeably.',
    emoji: '🟣',
  },
  {
    id: 'palythoa-grandis',
    name: 'Grandis Palythoa',
    scientificName: 'Palythoa grandis',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'low',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Large-polyped palythoa with brown-to-olive bodies and subtle green fluorescence. One of the biggest palythoa species, with polyps reaching over an inch in diameter.',
    careNotes:
      'CAUTION: Contains high concentrations of palytoxin — always use gloves and eye protection. Tolerates low light very well. Spreads across rock surfaces by runners. Extremely durable once established.',
    emoji: '🟤',
  },
  {
    id: 'sinularia',
    name: 'Finger Leather Coral',
    scientificName: 'Sinularia sp.',
    coralType: 'soft',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'middle',
    aggressiveness: 'semi-aggressive',
    description:
      'Upright finger-like projections that sway with the current, coloured cream to yellow-tan. One of the most common and recognizable soft corals in the hobby.',
    careNotes:
      'Extremely hardy — often recommended as a first coral. Periodically retracts and sheds a waxy film (normal behaviour). Releases terpenoids that can irritate sensitive corals; run carbon if placing near LPS or SPS.',
    emoji: '🫵',
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
  // ── LPS Corals (additional) ──────────────────────────────────────────────
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
  {
    id: 'goniopora',
    name: 'Goniopora (Flowerpot Coral)',
    scientificName: 'Goniopora stokesi',
    coralType: 'lps',
    difficulty: 'intermediate',
    lightRequirement: 'medium',
    flowRequirement: 'low',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Masses of long-stalked polyps that extend dramatically during the day, giving the colony a lush, flower-garden appearance. Green and brown morphs are most common.',
    careNotes:
      'Historically finicky but captive-raised specimens are much hardier. Needs low, indirect flow — direct current damages extending polyps. Benefits greatly from weekly target feeding with copepods or reef roids.',
    emoji: '🌸',
  },
  {
    id: 'war-coral',
    name: 'War Coral',
    scientificName: 'Favites sp.',
    coralType: 'lps',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'aggressive',
    description:
      'Encrusting brain-like LPS with vivid contrasting colors — typically reds, greens, and oranges arranged in a maze-like pattern. Highly collectible for its bold appearance.',
    careNotes:
      'Aggressive — releases long sweeper tentacles at night that can sting neighbors 3–4 inches away. Give adequate spacing. Tolerates moderate to high lighting. Hardy once established; target feed monthly.',
    emoji: '🔴',
  },
  {
    id: 'favia-coral',
    name: 'Favia Brain Coral',
    scientificName: 'Favia sp.',
    coralType: 'lps',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'medium',
    placement: 'bottom',
    aggressiveness: 'aggressive',
    description:
      'Classic dome-shaped brain coral with tightly packed corallites in bold color combinations — greens, reds, and multicolors are common. A staple of the reef hobby.',
    careNotes:
      'Extends long mesenterial filaments at night to digest or sting neighboring corals — give 4–6 inch clearance. Very tolerant of varied lighting and flow. One of the hardier LPS brain corals available.',
    emoji: '🧠',
  },
  {
    id: 'lobo-coral',
    name: 'Lobophyllia',
    scientificName: 'Lobophyllia hemprichii',
    coralType: 'lps',
    difficulty: 'beginner',
    lightRequirement: 'medium',
    flowRequirement: 'low',
    placement: 'bottom',
    aggressiveness: 'semi-aggressive',
    description:
      'Large-fleshed, ridged LPS that sits on the sandbed in colors ranging from dull brown to vivid red, pink, and green. Related to brain corals but with a more open structure.',
    careNotes:
      'Very forgiving and one of the best beginner LPS corals. Prefers placement on the sandbed or a low rock shelf. Low to moderate flow. Feeds readily on meaty foods placed directly on the polyp.',
    emoji: '🧬',
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
    id: 'acropora-tenuis',
    name: 'Acropora Tenuis',
    scientificName: 'Acropora tenuis',
    coralType: 'sps',
    difficulty: 'advanced',
    lightRequirement: 'very-high',
    flowRequirement: 'high',
    placement: 'top',
    aggressiveness: 'semi-aggressive',
    description:
      'A table or branching Acropora with thin, uniform branches and vivid coloration — available in blue, yellow, and green morphs. Highly collectible and a flagship SPS species.',
    careNotes:
      'Extremely parameter-sensitive. Requires NSW-level water quality. Dose two-part or run a calcium reactor. Any brown-out is usually a sign of high nutrients or insufficient light. High, chaotic flow is essential.',
    emoji: '🌊',
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
