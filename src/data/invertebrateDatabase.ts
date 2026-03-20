import { Invertebrate } from '../types';

export const INVERTEBRATE_DATABASE: Invertebrate[] = [
  // ── Shrimp ───────────────────────────────────────────────────────────────
  {
    id: 'amano-shrimp',
    name: 'Amano Shrimp',
    scientificName: 'Caridina multidentata',
    invertType: 'shrimp',
    tankType: ['freshwater', 'planted'],
    difficulty: 'beginner',
    minTankSize: 10,
    temperatureRange: [65, 78],
    description:
      'Transparent shrimp with dotted-dashed lateral lines. Renowned as the premier algae-eating shrimp in the hobby — a single Amano can consume impressive quantities of hair algae and biofilm overnight.',
    careNotes:
      'Hardy and peaceful; suitable with most community fish. Avoid copper-based medications, which are lethal to shrimp. Do not keep with larger fish that may eat them. Cannot breed in fresh water.',
    cleaningRole: 'Exceptional algae eater — consumes hair algae, thread algae, and biofilm.',
    emoji: '🦐',
  },
  {
    id: 'cherry-shrimp',
    name: 'Cherry Shrimp',
    scientificName: 'Neocaridina davidi',
    invertType: 'shrimp',
    tankType: ['freshwater', 'planted'],
    difficulty: 'beginner',
    minTankSize: 5,
    temperatureRange: [65, 80],
    description:
      'Vibrant red shrimp that bring a pop of color to planted tanks. Highly adaptable and prolific breeders, making them one of the most popular freshwater invertebrates.',
    careNotes:
      'Sensitive to copper and ammonia spikes. Breed readily in stable conditions — expect a colony to grow fast. Good with peaceful nano fish but will be eaten by larger species. Feed with dedicated shrimp pellets and blanched vegetables.',
    cleaningRole: 'Grazes on algae, biofilm, and detritus — excellent tank cleaners.',
    emoji: '🍒',
  },
  {
    id: 'crystal-red-shrimp',
    name: 'Crystal Red Shrimp',
    scientificName: 'Caridina cantonensis',
    invertType: 'shrimp',
    tankType: ['freshwater'],
    difficulty: 'advanced',
    minTankSize: 10,
    temperatureRange: [62, 74],
    description:
      'Striking red-and-white banded shrimp graded from the low-grade "C" to the prized "SSS" pattern. One of the most sought-after freshwater invertebrates.',
    careNotes:
      'Demanding — requires soft, acidic water (pH 6.0–6.8, TDS 100–150). Very sensitive to ammonia, nitrite, and temperature swings. Breed only in a species-only or nano shrimp tank. Active soil substrate recommended.',
    emoji: '❄️',
  },
  {
    id: 'peppermint-shrimp',
    name: 'Peppermint Shrimp',
    scientificName: 'Lysmata wurdemanni',
    invertType: 'shrimp',
    tankType: ['saltwater', 'reef'],
    difficulty: 'beginner',
    minTankSize: 10,
    temperatureRange: [72, 78],
    description:
      'Translucent shrimp with vivid red-and-white stripes. Famous in reef tanks for their appetite for the nuisance anemone Aiptasia, which they consume eagerly.',
    careNotes:
      'Excellent Aiptasia control. Generally reef-safe, though may pick at small, weak corals when hungry. Keep in groups of 3+ for best results. Avoid keeping with dottybacks or large wrasses that will hunt them.',
    cleaningRole: 'Eats Aiptasia anemones; also scavenges detritus.',
    emoji: '🍬',
  },
  {
    id: 'cleaner-shrimp',
    name: 'Scarlet Skunk Cleaner Shrimp',
    scientificName: 'Lysmata amboinensis',
    invertType: 'shrimp',
    tankType: ['saltwater', 'reef'],
    difficulty: 'beginner',
    minTankSize: 20,
    temperatureRange: [72, 80],
    description:
      'Bright red body with distinctive white antennae and a white-striped back. Establishes "cleaning stations" where fish line up to have parasites and dead tissue removed.',
    careNotes:
      'Reef-safe and extremely peaceful. Will even clean the hands of hobbyists! Sensitive to rapid salinity or pH swings. Provide rocky overhangs for shelter. Acclimate slowly.',
    cleaningRole: 'Removes parasites and dead tissue from fish at cleaning stations.',
    emoji: '✂️',
  },
  // ── Snails ───────────────────────────────────────────────────────────────
  {
    id: 'nerite-snail',
    name: 'Nerite Snail',
    scientificName: 'Neritina sp.',
    invertType: 'snail',
    tankType: ['freshwater', 'saltwater', 'planted'],
    difficulty: 'beginner',
    minTankSize: 5,
    temperatureRange: [65, 82],
    description:
      'Small, dome-shaped snails with beautifully patterned shells in zebra, tiger, and olive varieties. Among the best algae-eating snails available for aquariums.',
    careNotes:
      'Cannot breed in fresh water (larvae require brackish), so population stays controlled. Will not eat healthy plants. May escape the tank — keep a tight lid. Sensitive to copper medications.',
    cleaningRole: 'Excellent at removing green spot algae, diatoms, and hair algae from glass and decor.',
    emoji: '🐌',
  },
  {
    id: 'mystery-snail',
    name: 'Mystery Snail',
    scientificName: 'Pomacea bridgesii',
    invertType: 'snail',
    tankType: ['freshwater', 'planted'],
    difficulty: 'beginner',
    minTankSize: 5,
    temperatureRange: 	[65, 82],
    description:
      'Large, globular snails with attractive shells in gold, blue, brown, and ivory variants. Active and personable — often described as the "puppy dogs" of the snail world.',
    careNotes:
      'Herbivorous but generally safe with healthy plants; will consume dying or soft leaves. Provide a calcium-rich diet (blanched vegetables, cuttlebone) to maintain shell integrity. Lay egg masses above the waterline — remove if you do not want reproduction.',
    cleaningRole: 'Grazes on algae, leftover food, and detritus.',
    emoji: '🐚',
  },
  {
    id: 'turbo-snail',
    name: 'Turbo Snail',
    scientificName: 'Turbo fluctuosa',
    invertType: 'snail',
    tankType: ['saltwater', 'reef'],
    difficulty: 'beginner',
    minTankSize: 30,
    temperatureRange: [72, 78],
    description:
      'Large, cone-shaped snails that are powerhouses for algae removal. A single turbo snail can mow down a surprising amount of green hair algae in one night.',
    careNotes:
      'May knock over frags and smaller corals due to their size and bulldozing movement. Needs stable alkalinity to maintain shell. Avoid overcrowding — they are voracious grazers and will strip a tank of algae quickly.',
    cleaningRole: 'Heavy-duty green hair algae grazer; excellent for larger reef tanks.',
    emoji: '🌀',
  },
  {
    id: 'nassarius-snail',
    name: 'Nassarius Snail',
    scientificName: 'Nassarius sp.',
    invertType: 'snail',
    tankType: ['saltwater', 'reef'],
    difficulty: 'beginner',
    minTankSize: 10,
    temperatureRange: [72, 80],
    description:
      'Small, bullet-shaped snails that spend most of their time buried in the sandbed, erupting en masse when food is detected. A fascinating and valuable cleanup crew member.',
    careNotes:
      'Essential for sandbed health — their burrowing aerates the substrate and prevents anaerobic pockets. Will not bother corals or fish. Detect meaty food from across the tank within seconds.',
    cleaningRole: 'Sandbed aerator; scavenges detritus and uneaten meaty food.',
    emoji: '🔍',
  },
  // ── Crabs ────────────────────────────────────────────────────────────────
  {
    id: 'blue-leg-hermit-crab',
    name: 'Blue Leg Hermit Crab',
    scientificName: 'Clibanarius tricolor',
    invertType: 'crab',
    tankType: ['saltwater', 'reef'],
    difficulty: 'beginner',
    minTankSize: 10,
    temperatureRange: [72, 80],
    description:
      'Tiny hermit crabs with vivid blue and red legs. One of the most popular and affordable reef cleanup crew members, working tirelessly to consume algae and detritus.',
    careNotes:
      'Generally reef-safe. May occasionally kill snails to steal their shells — keep spare empty shells available. Needs stable salinity. Avoid copper-based treatments. Works best in groups of 5 or more.',
    cleaningRole: 'Algae and detritus scavenger; also turns sandbed while foraging.',
    emoji: '🦀',
  },
  {
    id: 'emerald-crab',
    name: 'Emerald Crab',
    scientificName: 'Mithraculus sculptus',
    invertType: 'crab',
    tankType: ['saltwater', 'reef'],
    difficulty: 'beginner',
    minTankSize: 20,
    temperatureRange: [72, 78],
    description:
      'Vivid green crabs with a flattened body and strong claws. Prized for their ability to control bubble algae (Valonia), which few other animals will eat.',
    careNotes:
      'Generally reef-safe but may pick at small polyps or slow-moving invertebrates when hungry. Provide adequate meaty food to reduce aggression. Nocturnal — rarely seen during the day.',
    cleaningRole: 'One of the only reliable bubble algae (Valonia) eaters.',
    emoji: '💚',
  },
  // ── Urchins ──────────────────────────────────────────────────────────────
  {
    id: 'tuxedo-urchin',
    name: 'Tuxedo Urchin',
    scientificName: 'Mespilia globulus',
    invertType: 'urchin',
    tankType: ['saltwater', 'reef'],
    difficulty: 'beginner',
    minTankSize: 20,
    temperatureRange: [72, 78],
    description:
      'Striking urchin with alternating blue and black/red banded sections. Decorates itself with shell fragments, pebbles, and even coral frags for camouflage.',
    careNotes:
      'Reef-safe; will not harm healthy corals but may dislodge frags. Excellent coralline algae grazer. Provide adequate rockwork to graze. Feed nori sheets if algae supply is limited.',
    cleaningRole: 'Grazes coralline algae, turf algae, and encrusting organisms from rock surfaces.',
    emoji: '⭕',
  },
  // ── Starfish ─────────────────────────────────────────────────────────────
  {
    id: 'brittle-star',
    name: 'Brittle Star',
    scientificName: 'Ophiocoma sp.',
    invertType: 'starfish',
    tankType: ['saltwater', 'reef'],
    difficulty: 'beginner',
    minTankSize: 20,
    temperatureRange: [72, 78],
    description:
      'Multi-armed echinoderms with long, articulated arms. Spends the day hidden in rockwork and emerges at night to scavenge detritus from the sandbed.',
    careNotes:
      'Largely nocturnal — not often visible. Excellent sandbed scavenger. Acclimate very slowly (drip acclimation for 2+ hours). Avoid exposing to air during handling. Avoid green brittle stars which may catch small fish.',
    cleaningRole: 'Nocturnal sandbed scavenger; cleans detritus from under rocks.',
    emoji: '⭐',
  },
];

export function getInvertebrateById(id: string): Invertebrate | undefined {
  return INVERTEBRATE_DATABASE.find((i) => i.id === id);
}
