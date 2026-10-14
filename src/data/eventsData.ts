/**
 * Canonical Event Data Pipeline & Department Registry
 * Single authoritative source of truth for all festival and department events.
 */

export interface DepartmentInfo {
  id: string; // Canonical identifier e.g. "CSE", "AI", "CIVIL"
  name: string; // Full display name
  slug: string; // URL slug e.g. "cse", "ai", "civil"
  color: string; // Primary department jewel tone
  secondaryColor: string;
  accentColor: string;
  deepColor: string;
  highlightColor: string;
  aliases: string[]; // Normalized aliases for robust resolution
}

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: "AI",
    name: "Artificial Intelligence",
    slug: "ai",
    color: "#4d2b63",
    secondaryColor: "#d8c3e5",
    accentColor: "#ffd37a",
    deepColor: "#21132b",
    highlightColor: "#c39bdf",
    aliases: ["ai", "artificial-intelligence", "aids", "ai-ds", "ai-ml"]
  },
  {
    id: "CIVIL",
    name: "Civil Engineering",
    slug: "civil",
    color: "#50041d",
    secondaryColor: "#edc7d1",
    accentColor: "#ffd37a",
    deepColor: "#26020e",
    highlightColor: "#d77b97",
    aliases: ["civil", "civil-engineering", "ce", "civ"]
  },
  {
    id: "CSE",
    name: "Computer Science & Engineering",
    slug: "cse",
    color: "#03176b",
    secondaryColor: "#c5d2ff",
    accentColor: "#ffd37a",
    deepColor: "#020a32",
    highlightColor: "#8198ff",
    aliases: ["cse", "computer-science", "cs", "computer-science-engineering", "comp-sci"]
  },
  {
    id: "ECE",
    name: "Electronics & Communication",
    slug: "ece",
    color: "#3b0c3c",
    secondaryColor: "#e0c3e0",
    accentColor: "#ffd37a",
    deepColor: "#1b061c",
    highlightColor: "#c48ac6",
    aliases: ["ece", "electronics", "ec", "electronics-communication"]
  },
  {
    id: "EEE",
    name: "Electrical & Electronics",
    slug: "eee",
    color: "#342875",
    secondaryColor: "#d1cbf2",
    accentColor: "#ffd37a",
    deepColor: "#171238",
    highlightColor: "#a89ae8",
    aliases: ["eee", "electrical", "ee", "electrical-electronics"]
  },
  {
    id: "EIE",
    name: "Electronics & Instrumentation",
    slug: "eie",
    color: "#5a0a2e",
    secondaryColor: "#edc5d6",
    accentColor: "#ffd37a",
    deepColor: "#280515",
    highlightColor: "#e28bb1",
    aliases: ["eie", "instrumentation", "ei", "electronics-instrumentation"]
  },
  {
    id: "MECHANICAL",
    name: "Mechanical Engineering",
    slug: "mechanical",
    color: "#1a2a6b",
    secondaryColor: "#c8d4f2",
    accentColor: "#ffd37a",
    deepColor: "#0b1232",
    highlightColor: "#8ea9ed",
    aliases: ["mechanical", "mech", "me", "mechanical-engineering"]
  }
];

export interface CanonicalEvent {
  id: string; // Stable unique identifier
  name: string; // Canonical event title
  title: string; // Compatibility alias for roller coaster views
  departmentId: string | string[]; // Single canonical dept ID or array if shared
  category: "Technical" | "Non-Technical" | "Workshop" | "Exhibition" | "Live music" | "Tournaments" | "Stage show" | "Dance" | "Fireworks" | string;
  description: string;
  blurb: string; // Short summary
  details?: string;
  date: string | null;
  time: string | null;
  venue: string | null;
  price: string | null;
  club_name?: string | null;
  rulebook?: string | null;
  registrationUrl: string | null;
  registerUrl: string; // Compatibility alias
  image_url?: string | null;
  image?: string | null;
}

/**
 * Resolves any raw query parameter, slug, or alias to a canonical department ID.
 */
export function resolveDepartmentId(input: string | null | undefined): string | null {
  if (!input) return null;
  const cleaned = input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  for (const dept of DEPARTMENTS) {
    if (dept.id.toLowerCase() === cleaned || dept.slug === cleaned || dept.aliases.includes(cleaned)) {
      return dept.id;
    }
  }
  return null;
}

/**
 * Retrieves department configuration by ID or alias.
 */
export function getDepartmentInfo(input: string | null | undefined): DepartmentInfo | null {
  const canonicalId = resolveDepartmentId(input);
  if (!canonicalId) return null;
  return DEPARTMENTS.find(d => d.id === canonicalId) ?? null;
}

/**
 * Authoritative Canonical Event Records.
 * Each department hosts real Technical and Non-Technical events with distinct schedules and descriptions.
 */
export const CANONICAL_EVENTS: CanonicalEvent[] = [
  /* ---------------- AI DEPARTMENT ---------------- */
  {
    id: "ai-neural-hack",
    name: "Neural Sprint Hackathon",
    title: "Neural Sprint Hackathon",
    departmentId: "AI",
    category: "Technical",
    description: "A 12-hour high-intensity AI modeling and deep learning sprint building multi-modal autonomous agents.",
    blurb: "A 12-hour high-intensity AI modeling and deep learning sprint building multi-modal autonomous agents.",
    details: "Open to teams of 2 to 4. Datasets and cloud compute credits provided on arrival. Solutions judged on novelty, accuracy, and real-world impact.",
    date: "Fri 6 Nov",
    time: "10:00 AM",
    venue: "AI Pavilion Lab",
    price: "Free entry",
    club_name: "AI & Robotics Society",
    registrationUrl: "#/register/ai-neural-hack",
    registerUrl: "#/register/ai-neural-hack",
    image_url: null
  },
  {
    id: "ai-bot-wars",
    name: "Autonomous Bot Wars",
    title: "Autonomous Bot Wars",
    departmentId: "AI",
    category: "Technical",
    description: "Custom AI combat rovers compete in an obstacle-laden arena using onboard computer vision.",
    blurb: "Custom AI combat rovers compete in an obstacle-laden arena using onboard computer vision.",
    details: "Bots must navigate autonomously without manual remote control. Elimination brackets run until the sundown championship match.",
    date: "Sat 7 Nov",
    time: "2:30 PM",
    venue: "Arena Grid A",
    price: "₹199",
    club_name: "Robotics Club",
    registrationUrl: "#/register/ai-bot-wars",
    registerUrl: "#/register/ai-bot-wars",
    image_url: null
  },
  {
    id: "ai-promptcraft",
    name: "Promptcraft Masters",
    title: "Promptcraft Masters",
    departmentId: "AI",
    category: "Non-Technical",
    description: "Fast-paced prompt engineering showdown where contestants generate stunning visuals and text under timed constraints.",
    blurb: "Fast-paced prompt engineering showdown where contestants generate stunning visuals and text under timed constraints.",
    details: "Three rounds of creative prompts testing model steering, logic puzzles, and generative storytelling. Individual participation.",
    date: "Sat 7 Nov",
    time: "5:00 PM",
    venue: "AI Stage B",
    price: "₹99",
    club_name: "Design & Generative Guild",
    registrationUrl: "#/register/ai-promptcraft",
    registerUrl: "#/register/ai-promptcraft",
    image_url: null
  },
  {
    id: "ai-escape-room",
    name: "The Rogue Algorithm Escape",
    title: "The Rogue Algorithm Escape",
    departmentId: "AI",
    category: "Non-Technical",
    description: "An immersive sci-fi puzzle room where participants decode hidden cyber clues to shut down a rogue neural network.",
    blurb: "An immersive sci-fi puzzle room where participants decode hidden cyber clues to shut down a rogue neural network.",
    details: "Teams of 3 must solve 5 cyber-physical locks within 25 minutes. No prior coding experience required.",
    date: "Sun 8 Nov",
    time: "11:00 AM",
    venue: "AI Tent Enclosure",
    price: "₹149",
    club_name: "Cyber Escapes",
    registrationUrl: "#/register/ai-escape-room",
    registerUrl: "#/register/ai-escape-room",
    image_url: null
  },
  {
    id: "ai-art-gallery",
    name: "SynthArt Gala & Showcase",
    title: "SynthArt Gala & Showcase",
    departmentId: "AI",
    category: "Exhibition",
    description: "Interactive digital art installation blending generative diffusion visuals with real-time biometric attendee interaction.",
    blurb: "Interactive digital art installation blending generative diffusion visuals with real-time biometric attendee interaction.",
    details: "Continuous exhibition featuring top student submissions and open floor interactive digital canvases.",
    date: "Sun 8 Nov",
    time: "6:00 PM",
    venue: "Midway Pavilion",
    price: "Free entry",
    club_name: "Media Arts",
    registrationUrl: "#/register/ai-art-gallery",
    registerUrl: "#/register/ai-art-gallery",
    image_url: null
  },

  /* ---------------- CSE DEPARTMENT ---------------- */
  {
    id: "cse-codesprint",
    name: "CodeSprint 24-Hr Hackathon",
    title: "CodeSprint 24-Hr Hackathon",
    departmentId: "CSE",
    category: "Technical",
    description: "Flagship overnight hackathon solving real-world challenges across Web3, Cloud, and Developer Tools.",
    blurb: "Flagship overnight hackathon solving real-world challenges across Web3, Cloud, and Developer Tools.",
    details: "Teams of up to 4. Mentors available throughout the night. Midnight pizzas, snacks, and prizes worth over ₹50,000.",
    date: "Fri 6 Nov",
    time: "6:00 PM",
    venue: "Turing Hall",
    price: "Free entry",
    club_name: "Open Source Collective",
    registrationUrl: "#/register/cse-codesprint",
    registerUrl: "#/register/cse-codesprint",
    image_url: null
  },
  {
    id: "cse-ctf-arena",
    name: "ByteBreaker CTF Arena",
    title: "ByteBreaker CTF Arena",
    departmentId: "CSE",
    category: "Technical",
    description: "Capture-The-Flag cybersecurity contest covering cryptography, reverse engineering, web exploitation, and forensics.",
    blurb: "Capture-The-Flag cybersecurity contest covering cryptography, reverse engineering, web exploitation, and forensics.",
    details: "Jeopardy-style scoring board with live dynamic challenge releases every 30 minutes. High speed internet and isolated sandbox provided.",
    date: "Sat 7 Nov",
    time: "11:00 AM",
    venue: "Cyber Lab 3",
    price: "₹149",
    club_name: "Cybersec Cell",
    registrationUrl: "#/register/cse-ctf-arena",
    registerUrl: "#/register/cse-ctf-arena",
    image_url: null
  },
  {
    id: "cse-blind-coding",
    name: "Blind Coding Championship",
    title: "Blind Coding Championship",
    departmentId: "CSE",
    category: "Technical",
    description: "Code complex algorithms with monitors turned off! Only pure logic and muscle memory will prevail.",
    blurb: "Code complex algorithms with monitors turned off! Only pure logic and muscle memory will prevail.",
    details: "Single elimination brackets. 30 minutes to solve 2 algorithmic problems without seeing syntax errors until compilation.",
    date: "Sat 7 Nov",
    time: "3:30 PM",
    venue: "Terminal Annex",
    price: "₹99",
    club_name: "Code Club",
    registrationUrl: "#/register/cse-blind-coding",
    registerUrl: "#/register/cse-blind-coding",
    image_url: null
  },
  {
    id: "cse-lan-tournament",
    name: "Midway LAN Showdown",
    title: "Midway LAN Showdown",
    departmentId: "CSE",
    category: "Non-Technical",
    description: "High-octane collegiate esports tournament featuring Valorant and BGMI bracket play.",
    blurb: "High-octane collegiate esports tournament featuring Valorant and BGMI bracket play.",
    details: "5v5 tactical tournament on low-latency dedicated tournament servers. Live shoutcasting on the carnival big screen.",
    date: "Sun 8 Nov",
    time: "1:00 PM",
    venue: "Esports Zone",
    price: "₹249",
    club_name: "Esports Arena",
    registrationUrl: "#/register/cse-lan-tournament",
    registerUrl: "#/register/cse-lan-tournament",
    image_url: null
  },
  {
    id: "cse-ui-duel",
    name: "Speed UI Duel",
    title: "Speed UI Duel",
    departmentId: "CSE",
    category: "Non-Technical",
    description: "Replicate complex, pixel-perfect web interfaces within 45 minutes using pure HTML & CSS.",
    blurb: "Replicate complex, pixel-perfect web interfaces within 45 minutes using pure HTML & CSS.",
    details: "Judged on responsive behavior, visual fidelity, and clean design hierarchy.",
    date: "Sun 8 Nov",
    time: "4:30 PM",
    venue: "Design Pavilion",
    price: "Free entry",
    club_name: "Frontend Guild",
    registrationUrl: "#/register/cse-ui-duel",
    registerUrl: "#/register/cse-ui-duel",
    image_url: null
  },

  /* ---------------- CIVIL DEPARTMENT ---------------- */
  {
    id: "civil-bridge-craft",
    name: "Truss Titan: Bridge Craft",
    title: "Truss Titan: Bridge Craft",
    departmentId: "CIVIL",
    category: "Technical",
    description: "Design and build a lightweight balsa-wood truss bridge, then test its ultimate load capacity on hydraulic presses.",
    blurb: "Design and build a lightweight balsa-wood truss bridge, then test its ultimate load capacity on hydraulic presses.",
    details: "Materials supplied at the venue. Highest strength-to-weight ratio wins the coveted Truss Trophy.",
    date: "Fri 6 Nov",
    time: "11:00 AM",
    venue: "Structures Bay",
    price: "₹149",
    club_name: "ASCE Chapter",
    registrationUrl: "#/register/civil-bridge-craft",
    registerUrl: "#/register/civil-bridge-craft",
    image_url: null
  },
  {
    id: "civil-smart-city",
    name: "Smart City & BIM Expo",
    title: "Smart City & BIM Expo",
    departmentId: "CIVIL",
    category: "Technical",
    description: "3D architectural planning and sustainable infrastructure designs using modern BIM and GIS software.",
    blurb: "3D architectural planning and sustainable infrastructure designs using modern BIM and GIS software.",
    details: "Participants present 3D walkthroughs addressing transit, drainage, and renewable green energy grids.",
    date: "Sat 7 Nov",
    time: "10:00 AM",
    venue: "CAD Laboratory",
    price: "Free entry",
    club_name: "Urban Planners",
    registrationUrl: "#/register/civil-smart-city",
    registerUrl: "#/register/civil-smart-city",
    image_url: null
  },
  {
    id: "civil-survey-hunt",
    name: "Theodolite Geocache Hunt",
    title: "Theodolite Geocache Hunt",
    departmentId: "CIVIL",
    category: "Technical",
    description: "Use precision total stations and optical levels to decipher surveying coordinates and uncover hidden markers.",
    blurb: "Use precision total stations and optical levels to decipher surveying coordinates and uncover hidden markers.",
    details: "Combines surveying fieldwork with competitive treasure hunting across the festival lawn.",
    date: "Sat 7 Nov",
    time: "2:00 PM",
    venue: "Carnival Fairgrounds",
    price: "₹99",
    club_name: "Surveying Guild",
    registrationUrl: "#/register/civil-survey-hunt",
    registerUrl: "#/register/civil-survey-hunt",
    image_url: null
  },
  {
    id: "civil-concrete-bowling",
    name: "Concrete Bowling Derby",
    title: "Concrete Bowling Derby",
    departmentId: "CIVIL",
    category: "Non-Technical",
    description: "Cast customized lightweight concrete spheres and bowl them down a grassy obstacle lane!",
    blurb: "Cast customized lightweight concrete spheres and bowl them down a grassy obstacle lane!",
    details: "Points scored for both pin strikes and durability of the casted ball.",
    date: "Sun 8 Nov",
    time: "12:30 PM",
    venue: "Lawn Alley",
    price: "₹99",
    club_name: "Concrete Enthusiasts",
    registrationUrl: "#/register/civil-concrete-bowling",
    registerUrl: "#/register/civil-concrete-bowling",
    image_url: null
  },
  {
    id: "civil-tower-stack",
    name: "Seismic Tower Shake-Off",
    title: "Seismic Tower Shake-Off",
    departmentId: "CIVIL",
    category: "Non-Technical",
    description: "Construct towering earthquake-resistant skyscrapers from spaghetti and clay, then withstand the shake table!",
    blurb: "Construct towering earthquake-resistant skyscrapers from spaghetti and clay, then withstand the shake table!",
    details: "Shake table frequency ramps up every 60 seconds until only one surviving structure remains standing.",
    date: "Sun 8 Nov",
    time: "4:00 PM",
    venue: "Dynamics Rig",
    price: "₹149",
    club_name: "Structural Dynamics",
    registrationUrl: "#/register/civil-tower-stack",
    registerUrl: "#/register/civil-tower-stack",
    image_url: null
  },

  /* ---------------- ECE DEPARTMENT ---------------- */
  {
    id: "ece-silicon-sprint",
    name: "Silicon Circuit Sprint",
    title: "Silicon Circuit Sprint",
    departmentId: "ECE",
    category: "Technical",
    description: "High-speed analog and digital schematic breadboarding and logic gate timing challenge.",
    blurb: "High-speed analog and digital schematic breadboarding and logic gate timing challenge.",
    details: "Components, breadboards, oscilloscopes, and function generators provided. Scored on signal cleanliness and speed.",
    date: "Fri 6 Nov",
    time: "2:00 PM",
    venue: "VLSI Suite",
    price: "Free entry",
    club_name: "IEEE Student Branch",
    registrationUrl: "#/register/ece-silicon-sprint",
    registerUrl: "#/register/ece-silicon-sprint",
    image_url: null
  },
  {
    id: "ece-drone-obstacle",
    name: "Micro-Drone Obstacle Derby",
    title: "Micro-Drone Obstacle Derby",
    departmentId: "ECE",
    category: "Technical",
    description: "Navigate agile FPV nano-drones through illuminated neon rings, wind tunnels, and tight hairpin gates.",
    blurb: "Navigate agile FPV nano-drones through illuminated neon rings, wind tunnels, and tight hairpin gates.",
    details: "Timed trial heats followed by direct head-to-head drag races. Bring your own drone or pilot festival loaners.",
    date: "Sat 7 Nov",
    time: "11:30 AM",
    venue: "Arena Airspace",
    price: "₹199",
    club_name: "AeroTech Society",
    registrationUrl: "#/register/ece-drone-obstacle",
    registerUrl: "#/register/ece-drone-obstacle",
    image_url: null
  },
  {
    id: "ece-embedded-iot",
    name: "Connected Edge IoT Hack",
    title: "Connected Edge IoT Hack",
    departmentId: "ECE",
    category: "Technical",
    description: "Build sensor-to-cloud telemetry systems using ESP32 and BLE protocols within 4 hours.",
    blurb: "Build sensor-to-cloud telemetry systems using ESP32 and BLE protocols within 4 hours.",
    details: "Sensor kits provided. Solutions evaluated on power efficiency, dashboard latency, and practical utility.",
    date: "Sat 7 Nov",
    time: "3:00 PM",
    venue: "Embedded Lab",
    price: "₹149",
    club_name: "IoT Developers",
    registrationUrl: "#/register/ece-embedded-iot",
    registerUrl: "#/register/ece-embedded-iot",
    image_url: null
  },
  {
    id: "ece-laser-maze",
    name: "Photon Laser Maze",
    title: "Photon Laser Maze",
    departmentId: "ECE",
    category: "Non-Technical",
    description: "Crawl, vault, and weave through a foggy chamber crisscrossed with green laser tripwires without breaking the beam!",
    blurb: "Crawl, vault, and weave through a foggy chamber crisscrossed with green laser tripwires without breaking the beam!",
    details: "Individual timed agility challenge with ambient synthwave music and smoke effects.",
    date: "Sun 8 Nov",
    time: "1:30 PM",
    venue: "Dark Room Pavillion",
    price: "₹99",
    club_name: "Optics Society",
    registrationUrl: "#/register/ece-laser-maze",
    registerUrl: "#/register/ece-laser-maze",
    image_url: null
  },
  {
    id: "ece-signal-sleuth",
    name: "Signal Sleuth: Frequency Hunt",
    title: "Signal Sleuth: Frequency Hunt",
    departmentId: "ECE",
    category: "Non-Technical",
    description: "Decipher Morse and RF bursts transmitted across the midway using handheld SDR receivers.",
    blurb: "Decipher Morse and RF bursts transmitted across the midway using handheld SDR receivers.",
    details: "Follow radio signals to uncover the secret festival transmitter station.",
    date: "Sun 8 Nov",
    time: "5:00 PM",
    venue: "Fairground Perimeter",
    price: "Free entry",
    club_name: "Amateur Radio Club",
    registrationUrl: "#/register/ece-signal-sleuth",
    registerUrl: "#/register/ece-signal-sleuth",
    image_url: null
  },

  /* ---------------- EEE DEPARTMENT ---------------- */
  {
    id: "eee-tesla-expo",
    name: "Tesla Coil Musical Showcase",
    title: "Tesla Coil Musical Showcase",
    departmentId: "EEE",
    category: "Technical",
    description: "Witness resonant solid-state Tesla coils generate 6-foot electric arcs modulated to play musical melodies.",
    blurb: "Witness resonant solid-state Tesla coils generate 6-foot electric arcs modulated to play musical melodies.",
    details: "Live explanation of resonant frequency tuning, safety interlocks, and atmospheric plasma physics.",
    date: "Fri 6 Nov",
    time: "7:00 PM",
    venue: "High Voltage Yard",
    price: "Free entry",
    club_name: "Power Systems Society",
    registrationUrl: "#/register/eee-tesla-expo",
    registerUrl: "#/register/eee-tesla-expo",
    image_url: null
  },
  {
    id: "eee-ev-chassis",
    name: "EV Powertrain & Regen Race",
    title: "EV Powertrain & Regen Race",
    departmentId: "EEE",
    category: "Technical",
    description: "Optimize brushless DC motor controllers and regenerative braking algorithms for electric karts.",
    blurb: "Optimize brushless DC motor controllers and regenerative braking algorithms for electric karts.",
    details: "Teams program drive cycles and test efficiency on bench dynos. Highest energy recovery wins.",
    date: "Sat 7 Nov",
    time: "10:30 AM",
    venue: "Power Lab",
    price: "₹149",
    club_name: "EV Innovations Hub",
    registrationUrl: "#/register/eee-ev-chassis",
    registerUrl: "#/register/eee-ev-chassis",
    image_url: null
  },
  {
    id: "eee-grid-sim",
    name: "Blackout: Grid Restoration",
    title: "Blackout: Grid Restoration",
    departmentId: "EEE",
    category: "Technical",
    description: "Manage a simulated regional power grid under extreme renewable fluctuations and sudden transmission trips.",
    blurb: "Manage a simulated regional power grid under extreme renewable fluctuations and sudden transmission trips.",
    details: "Maintain grid frequency between 49.9 and 50.1 Hz while routing emergency power across interconnected nodes.",
    date: "Sat 7 Nov",
    time: "2:30 PM",
    venue: "Simulation Annex",
    price: "Free entry",
    club_name: "Grid Operators Club",
    registrationUrl: "#/register/eee-grid-sim",
    registerUrl: "#/register/eee-grid-sim",
    image_url: null
  },
  {
    id: "eee-wire-blitz",
    name: "Wire & Spark Speedrun",
    title: "Wire & Spark Speedrun",
    departmentId: "EEE",
    category: "Non-Technical",
    description: "Fun dexterity challenge: guide an electric wand loop along a twisty charged wire without sounding the buzzer!",
    blurb: "Fun dexterity challenge: guide an electric wand loop along a twisty charged wire without sounding the buzzer!",
    details: "Instant elimination buzzer with 3 difficulty courses. Top times win festival ride passes.",
    date: "Sun 8 Nov",
    time: "12:00 PM",
    venue: "EEE Tent Stage",
    price: "₹99",
    club_name: "Electro-Fun",
    registrationUrl: "#/register/eee-wire-blitz",
    registerUrl: "#/register/eee-wire-blitz",
    image_url: null
  },
  {
    id: "eee-energy-quiz",
    name: "Megawatt Trivia Bowl",
    title: "Megawatt Trivia Bowl",
    departmentId: "EEE",
    category: "Non-Technical",
    description: "Fast-paced buzzer trivia on inventors, nuclear power, renewable breakthroughs, and electrical anomalies.",
    blurb: "Fast-paced buzzer trivia on inventors, nuclear power, renewable breakthroughs, and electrical anomalies.",
    details: "Teams of two. Exciting rapid-fire buzzer rounds with audience spot prizes.",
    date: "Sun 8 Nov",
    time: "3:30 PM",
    venue: "Amphitheatre",
    price: "Free entry",
    club_name: "Quiz Society",
    registrationUrl: "#/register/eee-energy-quiz",
    registerUrl: "#/register/eee-energy-quiz",
    image_url: null
  },

  /* ---------------- EIE DEPARTMENT ---------------- */
  {
    id: "eie-sensor-fusion",
    name: "Sensor Fusion & Telemetry",
    title: "Sensor Fusion & Telemetry",
    departmentId: "EIE",
    category: "Technical",
    description: "Calibrate and fuse ultrasonic, lidar, and IMU sensor data using Kalman filters in real time.",
    blurb: "Calibrate and fuse ultrasonic, lidar, and IMU sensor data using Kalman filters in real time.",
    details: "Hardware kits provided. Teams produce live calibrated distance and orientation readings under noise interference.",
    date: "Fri 6 Nov",
    time: "1:30 PM",
    venue: "Instrumentation Lab",
    price: "Free entry",
    club_name: "ISA Chapter",
    registrationUrl: "#/register/eie-sensor-fusion",
    registerUrl: "#/register/eie-sensor-fusion",
    image_url: null
  },
  {
    id: "eie-plc-expo",
    name: "PLC Automation Challenge",
    title: "PLC Automation Challenge",
    departmentId: "EIE",
    category: "Technical",
    description: "Program industrial ladder logic to automate a multi-stage carnival bottling and sorting conveyor.",
    blurb: "Program industrial ladder logic to automate a multi-stage carnival bottling and sorting conveyor.",
    details: "Tested on fault detection, cycle time minimization, and emergency stop compliance.",
    date: "Sat 7 Nov",
    time: "11:00 AM",
    venue: "Process Bay",
    price: "₹149",
    club_name: "Automation Guild",
    registrationUrl: "#/register/eie-plc-expo",
    registerUrl: "#/register/eie-plc-expo",
    image_url: null
  },
  {
    id: "eie-biomed-hack",
    name: "Biomedical Signal Jam",
    title: "Biomedical Signal Jam",
    departmentId: "EIE",
    category: "Technical",
    description: "Capture and filter ECG and EMG bio-potentials to control prosthetic robotic grippers.",
    blurb: "Capture and filter ECG and EMG bio-potentials to control prosthetic robotic grippers.",
    details: "Real-time physiological instrumentation workshop and challenge with clinical grade sensors.",
    date: "Sat 7 Nov",
    time: "3:30 PM",
    venue: "Bio-Sensors Wing",
    price: "₹149",
    club_name: "Bio-Medix",
    registrationUrl: "#/register/eie-biomed-hack",
    registerUrl: "#/register/eie-biomed-hack",
    image_url: null
  },
  {
    id: "eie-transducer-hunt",
    name: "Transducer Mystery Quest",
    title: "Transducer Mystery Quest",
    departmentId: "EIE",
    category: "Non-Technical",
    description: "Solve cryptic physical clues by measuring temperature, light, and magnetic flux with smart multimeter probes.",
    blurb: "Solve cryptic physical clues by measuring temperature, light, and magnetic flux with smart multimeter probes.",
    details: "Hands-on exploratory game across the midway for enthusiasts of all backgrounds.",
    date: "Sun 8 Nov",
    time: "1:00 PM",
    venue: "Fairground Stalls",
    price: "₹99",
    club_name: "Sensors & Detectors",
    registrationUrl: "#/register/eie-transducer-hunt",
    registerUrl: "#/register/eie-transducer-hunt",
    image_url: null
  },
  {
    id: "eie-robot-arm",
    name: "Robo-Arm Precision Pick",
    title: "Robo-Arm Precision Pick",
    departmentId: "EIE",
    category: "Non-Technical",
    description: "Pilot a 6-DOF robotic manipulator to stack miniature carnival barrels against the clock!",
    blurb: "Pilot a 6-DOF robotic manipulator to stack miniature carnival barrels against the clock!",
    details: "Intuitive joystick controls. Fastest stack without toppling wins festival merchandise.",
    date: "Sun 8 Nov",
    time: "4:00 PM",
    venue: "Robotics Booth",
    price: "₹99",
    club_name: "Robotics Club",
    registrationUrl: "#/register/eie-robot-arm",
    registerUrl: "#/register/eie-robot-arm",
    image_url: null
  },

  /* ---------------- MECHANICAL DEPARTMENT ---------------- */
  {
    id: "mech-cadathon",
    name: "CAD-A-Thon 3D Assembly",
    title: "CAD-A-Thon 3D Assembly",
    departmentId: "MECHANICAL",
    category: "Technical",
    description: "Rapid 3D modeling, parametric assembly, and finite element stress analysis under live design briefs.",
    blurb: "Rapid 3D modeling, parametric assembly, and finite element stress analysis under live design briefs.",
    details: "SolidWorks and Fusion 360 available. Judged on geometric accuracy, tolerance considerations, and mass optimization.",
    date: "Fri 6 Nov",
    time: "3:00 PM",
    venue: "Design Studio 1",
    price: "Free entry",
    club_name: "ASME Student Chapter",
    registrationUrl: "#/register/mech-cadathon",
    registerUrl: "#/register/mech-cadathon",
    image_url: null
  },
  {
    id: "mech-rc-nitro",
    name: "Nitro RC Drag Championship",
    title: "Nitro RC Drag Championship",
    departmentId: "MECHANICAL",
    category: "Technical",
    description: "Scale nitro and brushless RC cars battle for the fastest quarter-second acceleration down the straightaway.",
    blurb: "Scale nitro and brushless RC cars battle for the fastest quarter-second acceleration down the straightaway.",
    details: "Classes for both spec chassis and custom modified drivetrains. Laser timed finish gate.",
    date: "Sat 7 Nov",
    time: "1:00 PM",
    venue: "Midway Speedway",
    price: "₹199",
    club_name: "Motorsports Club",
    registrationUrl: "#/register/mech-rc-nitro",
    registerUrl: "#/register/mech-rc-nitro",
    image_url: null
  },
  {
    id: "mech-junkyard-wars",
    name: "Junkyard Contraption Wars",
    title: "Junkyard Contraption Wars",
    departmentId: "MECHANICAL",
    category: "Technical",
    description: "Build working mechanical siege catapults and projectile launchers out of scrap metal, springs, and gears.",
    blurb: "Build working mechanical siege catapults and projectile launchers out of scrap metal, springs, and gears.",
    details: "Materials assigned via blind draft. Catapults evaluated on maximum range and target accuracy.",
    date: "Sat 7 Nov",
    time: "4:00 PM",
    venue: "Fabrication Yard",
    price: "₹149",
    club_name: "Makers Collective",
    registrationUrl: "#/register/mech-junkyard-wars",
    registerUrl: "#/register/mech-junkyard-wars",
    image_url: null
  },
  {
    id: "mech-hydro-rocket",
    name: "Water Rocket Launch Derby",
    title: "Water Rocket Launch Derby",
    departmentId: "MECHANICAL",
    category: "Non-Technical",
    description: "Pressurized water bottle rocketry: optimize aerodynamics, fin stabilization, and parachute recovery systems.",
    blurb: "Pressurized water bottle rocketry: optimize aerodynamics, fin stabilization, and parachute recovery systems.",
    details: "Highest altitude and longest air hang-time take top honors. Launch ramps and air pumps provided.",
    date: "Sun 8 Nov",
    time: "11:00 AM",
    venue: "Launch Field",
    price: "₹99",
    club_name: "Aeromodelling",
    registrationUrl: "#/register/mech-hydro-rocket",
    registerUrl: "#/register/mech-hydro-rocket",
    image_url: null
  },
  {
    id: "mech-lathe-showdown",
    name: "Machinist Precision Duel",
    title: "Machinist Precision Duel",
    departmentId: "MECHANICAL",
    category: "Technical",
    description: "Manual turning and milling precision duel producing exact stepped shafts to micron tolerances.",
    blurb: "Manual turning and milling precision duel producing exact stepped shafts to micron tolerances.",
    details: "Evaluation strictly based on Vernier micrometer and dial bore gauge inspections.",
    date: "Sun 8 Nov",
    time: "2:30 PM",
    venue: "Machine Shop",
    price: "Free entry",
    club_name: "Precision Engineers",
    registrationUrl: "#/register/mech-lathe-showdown",
    registerUrl: "#/register/mech-lathe-showdown",
    image_url: null
  },

  /* ---------------- INTER-DEPARTMENT SHARED EVENT ---------------- */
  {
    id: "shared-robo-nexus",
    name: "Robo-Nexus Autonomous Cup",
    title: "Robo-Nexus Autonomous Cup",
    departmentId: ["CSE", "AI", "ECE"], // Inter-disciplinary collaborative event
    category: "Technical",
    description: "Joint challenge combining real-time embedded vision, deep RL path planning, and edge firmware optimization.",
    blurb: "Joint challenge combining real-time embedded vision, deep RL path planning, and edge firmware optimization.",
    details: "Teams must integrate software models (AI), system architecture (CSE), and hardware controllers (ECE). Grand inter-dept trophy.",
    date: "Sun 8 Nov",
    time: "3:00 PM",
    venue: "Grand Arena",
    price: "₹299",
    club_name: "Joint Engineering Council",
    registrationUrl: "#/register/shared-robo-nexus",
    registerUrl: "#/register/shared-robo-nexus",
    image_url: null
  }
];

/**
 * Default General Festival Showcase Events (used when no specific department is selected)
 */
export const DEFAULT_FESTIVAL_EVENTS: CanonicalEvent[] = [
  {
    id: "neon-drop",
    name: "Neon Drop Concert",
    title: "Neon Drop Concert",
    departmentId: "FESTIVAL",
    category: "Live music",
    date: "Fri 6 Nov",
    time: "7:30 PM",
    venue: "Main Meadow",
    price: "₹799",
    blurb: "Opening night headliners play under the full length of the midway lights, with a laser finale timed to the midway lights.",
    description: "Opening night headliners play under the full length of the midway lights, with a laser finale timed to the midway lights.",
    details: "Three acts take the main stage, with doors at 6:45 PM. The laser finale starts at 10:40 PM. Standing room only on the lawn; a limited number of seats are held for ride-band holders.",
    registrationUrl: "#/register/neon-drop",
    registerUrl: "#/register/neon-drop"
  },
  {
    id: "lantern-market",
    name: "Lantern Market",
    title: "Lantern Market",
    departmentId: "FESTIVAL",
    category: "Food and craft",
    date: "Sat 7 Nov",
    time: "4:00 PM",
    venue: "Lantern Row",
    price: "Free entry",
    blurb: "Forty local kitchens and makers run stalls along a lantern-lit lane. Tasting tokens are sold at the gate.",
    description: "Forty local kitchens and makers run stalls along a lantern-lit lane. Tasting tokens are sold at the gate.",
    details: "Stalls open at 4:00 PM and run until the gates close. Tokens are ₹50 each and work at every stall. Vegetarian, vegan and Jain options are marked at each counter.",
    registrationUrl: "#/register/lantern-market",
    registerUrl: "#/register/lantern-market"
  },
  {
    id: "gravity-games",
    name: "Gravity Games",
    title: "Gravity Games",
    departmentId: "FESTIVAL",
    category: "Tournaments",
    date: "Sat 7 Nov",
    time: "11:00 AM",
    venue: "Arena Tent B",
    price: "₹299",
    blurb: "Team challenges, ring toss leagues and a timed obstacle run. Register a team of four before brackets fill.",
    description: "Team challenges, ring toss leagues and a timed obstacle run. Register a team of four before brackets fill.",
    details: "Brackets are seeded by registration order. Each team plays three rounds, and the top four go to the evening final. Closed shoes are required for the obstacle run.",
    registrationUrl: "#/register/gravity-games",
    registerUrl: "#/register/gravity-games"
  },
  {
    id: "midnight-illusions",
    name: "Midnight Illusions",
    title: "Midnight Illusions",
    departmentId: "FESTIVAL",
    category: "Stage show",
    date: "Sat 7 Nov",
    time: "10:30 PM",
    venue: "The Big Top",
    price: "₹599",
    blurb: "Close-up and stage magic in the big top, two sets nightly. Seating is general admission.",
    description: "Close-up and stage magic in the big top, two sets nightly. Seating is general admission.",
    details: "Two sets, 10:30 PM and 11:45 PM, about 40 minutes each. Front rows are close-up work, so phones stay away while the show runs. Suitable for ages 8 and up.",
    registrationUrl: "#/register/midnight-illusions",
    registerUrl: "#/register/midnight-illusions"
  },
  {
    id: "silent-disco",
    name: "Silent Disco",
    title: "Silent Disco",
    departmentId: "FESTIVAL",
    category: "Dance",
    date: "Sun 8 Nov",
    time: "8:00 PM",
    venue: "Midway Plaza",
    price: "₹399",
    blurb: "Three DJ channels, one dance floor. Headphones are included with every ticket.",
    description: "Three DJ channels, one dance floor. Headphones are included with every ticket.",
    details: "Pick a channel from the dial on your headphones and switch whenever you like. The plaza sits at the center of the midway. Headphones are returned at the exit.",
    registrationUrl: "#/register/silent-disco",
    registerUrl: "#/register/silent-disco"
  },
  {
    id: "skyburst-finale",
    name: "Skyburst Finale",
    title: "Skyburst Finale",
    departmentId: "FESTIVAL",
    category: "Fireworks",
    date: "Sun 8 Nov",
    time: "9:45 PM",
    venue: "Riverside Lawn",
    price: "₹349",
    blurb: "A ten-minute drone and fireworks show set to a live orchestra. Lawn gates close at 9:15 PM.",
    description: "A ten-minute drone and fireworks show set to a live orchestra. Lawn gates close at 9:15 PM.",
    details: "Bring a blanket; chairs are not allowed on the lawn. The orchestra starts a short pre-show at 9:30 PM. Shuttles run until midnight.",
    registrationUrl: "#/register/skyburst-finale",
    registerUrl: "#/register/skyburst-finale"
  }
];

/**
 * Filter events assigned to a specific department.
 */
export function getDepartmentEvents(departmentIdOrSlug: string | null | undefined): CanonicalEvent[] {
  if (!departmentIdOrSlug) return DEFAULT_FESTIVAL_EVENTS;
  const canonicalId = resolveDepartmentId(departmentIdOrSlug);
  if (!canonicalId) return DEFAULT_FESTIVAL_EVENTS;

  return CANONICAL_EVENTS.filter((ev) => {
    if (Array.isArray(ev.departmentId)) {
      return ev.departmentId.includes(canonicalId);
    }
    return ev.departmentId === canonicalId;
  });
}

/**
 * Get current active event safely with bounds checking.
 */
export function getCurrentEvent(departmentEvents: CanonicalEvent[], activeIndex: number): CanonicalEvent | null {
  if (!departmentEvents || departmentEvents.length === 0) return null;
  const clamped = Math.max(0, Math.min(activeIndex, departmentEvents.length - 1));
  return departmentEvents[clamped] ?? null;
}

/**
 * Validates the integrity of the event dataset.
 */
export function validateEventData(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const validDeptIds = new Set(DEPARTMENTS.map(d => d.id));

  for (const ev of CANONICAL_EVENTS) {
    if (seenIds.has(ev.id)) {
      errors.push(`Duplicate event ID detected: ${ev.id}`);
    }
    seenIds.add(ev.id);

    const depts = Array.isArray(ev.departmentId) ? ev.departmentId : [ev.departmentId];
    if (depts.length === 0) {
      errors.push(`Event ${ev.id} is missing departmentId assignment`);
    }
    for (const d of depts) {
      if (!validDeptIds.has(d)) {
        errors.push(`Event ${ev.id} references unknown departmentId: ${d}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
