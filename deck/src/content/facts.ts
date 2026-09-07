/* Every number here is checked. Nothing that is not in this file goes on a slide. */

export const URC = {
  teams: 116,
  countries: 18,
  finalists: 38,
  finalistCountries: 11,
  since: 2007,
}

export const TEAM = {
  members: 35,
  university: 'BRAC University, Bangladesh',
  departments: ['Computer Science', 'Electrical Engineering', 'Business', 'Microbiology', 'Natural Science', 'Architecture'],
  /** The chain the whole team hangs off. */
  leadership: ['Advisor', 'Team Lead', 'Co-Lead'],
  /* The six that build the rover. Each line is drawn from the rover's own spec in
     ROVER.specs below — nothing here is claimed that the machine does not do. */
  technical: [
    { name: 'Mechanical', what: 'Responsible for RnD, design, fabrication and assembly of the rover' },
    { name: 'Electronics', what: 'Responsible for power management, motor drivers and the boards the team designs itself' },
    { name: 'Controls & Software', what: 'Responsible for the software that controls the rover and the user interface' },
    { name: 'Autonomous', what: 'Responsible for the autonomous navigation and decision-making systems' },
    { name: 'Network & Vision', what: 'Responsible for the communication systems and visual perception' },
    { name: 'Astrobiology', what: 'Responsible for the astrobiology research and sample analysis' },
  ],
  /* And the two that do not touch the rover at all. */
  nonTechnical: [
    { name: 'PR & Outreach', what: 'Responsible for promoting the team and engaging with the community' },
    { name: 'Management', what: 'Responsible for team operations and strategic planning' },
  ],
  rovers: 12,
  firstSeason: 2018,
  currentRover: 'Taurus',
}

/* ---------- The machine ---------- */

export const ROVER = {
  name: 'Taurus',
  season: 2026,
  mass: '50 kg',
  envelope: '120 × 120 × 120 cm',
  specs: [
    { k: 'Arm', v: '7 degrees of freedom · lifts over 5 kg · grips 7.5 cm' },
    { k: 'Suspension', v: 'rocker-bogie · four airless wheels, all on the rock' },
    { k: 'Autonomy', v: 'ROS 2 Humble · RTK GNSS · ZED 2i stereo vision' },
    { k: 'Radio', v: 'three links on one mast · 3.3 km verified range' },
    { k: 'Science', v: 'onboard soil assay for biosignatures' },
    { k: 'Shell', v: 'aluminium, jamdani motifs etched into the flanks' },
  ],
}

export const ARM_COST = {
  commercial: { label: 'Commercial 6-axis arm', bdt: 500000, display: 'BDT 5,00,000+' },
  ours: { label: 'Ours · recycled brushed DC motors', bdt: 20000, display: 'under BDT 20,000' },
}

/* ---------- Finding a benchmark ---------- */

export const BENCHMARKS = [
  { code: 'IRC', name: 'International Rover Challenge', where: 'India' },
  { code: 'ERC', name: 'European Rover Challenge', where: 'Poland' },
  { code: 'URC', name: 'University Rover Challenge', where: 'Utah, USA', chosen: true },
]

export const JFK = {
  quote: 'We choose to go to the Moon in this decade and do the other things, not because they are easy, but because they are hard.',
  who: 'John F. Kennedy',
  where: 'Rice University · 12 September 1962',
}

/* The 38 finalists of URC 2026, as announced by The Mars Society on 18 March 2026.
   https://www.marssociety.org/news/2026/03/18/38-teams-advance-to-2026-university-rover-challenge-finals/ */
export interface Finalist {
  team: string
  uni: string
  country: string
}

export const FINALISTS: Finalist[] = [
  { team: 'Monash Nova Rover', uni: 'Monash University', country: 'Australia' },
  { team: 'AAUB Rover71', uni: 'Aviation and Aerospace University Bangladesh', country: 'Bangladesh' },
  { team: 'BRACU Mongol-Tori', uni: 'BRAC University', country: 'Bangladesh' },
  { team: 'MIST Mongol Barota', uni: 'Military Institute of Science and Technology', country: 'Bangladesh' },
  { team: 'Project Altair', uni: 'Islamic University of Technology', country: 'Bangladesh' },
  { team: 'UIU Mars Rover', uni: 'United International University', country: 'Bangladesh' },
  { team: 'Carleton Planetary Robotics Team', uni: 'Carleton University', country: 'Canada' },
  { team: "Queen's Space Engineering Team", uni: "Queen's University", country: 'Canada' },
  { team: 'Robotics for Space Exploration', uni: 'University of Toronto', country: 'Canada' },
  { team: 'Space Concordia', uni: 'Concordia University of Montreal', country: 'Canada' },
  { team: 'Team RUDRA – SRM Mars Rover', uni: 'SRM Institute of Science and Technology', country: 'India' },
  { team: 'KARURA', uni: 'Multiple institutions', country: 'International' },
  { team: 'Team DIANA', uni: 'Politecnico di Torino', country: 'Italy' },
  { team: 'ARES Project', uni: 'Multiple institutions', country: 'Japan' },
  { team: 'NAFT Mars Rover', uni: 'Multiple institutions', country: 'Japan' },
  { team: 'Mars Rover UdeG Space', uni: 'Universidad de Guadalajara', country: 'México' },
  { team: 'Quantum Robotics', uni: 'Multiple institutions', country: 'México' },
  { team: 'IMPULS', uni: 'Kielce University of Technology', country: 'Poland' },
  { team: 'KNR Rover Team', uni: 'Warsaw University of Technology', country: 'Poland' },
  { team: 'Legendary Rover', uni: 'Rzeszow University of Technology', country: 'Poland' },
  { team: 'MR2', uni: 'KAIST', country: 'Republic of Korea' },
  { team: 'Zenith Space', uni: 'Seoul National University of Science and Technology', country: 'Republic of Korea' },
  { team: 'YILDIZ ROVER', uni: 'Yıldız Technical University', country: 'Türkiye' },
  { team: 'A.S.T.R.A.', uni: 'University of Alabama in Huntsville', country: 'United States' },
  { team: 'Binghamton University Rover Team', uni: 'Binghamton University', country: 'United States' },
  { team: 'BYU Mars Rover', uni: 'Brigham Young University', country: 'United States' },
  { team: 'Cornell Mars Rover', uni: 'Cornell University', country: 'United States' },
  { team: 'DAM Robotics', uni: 'Oregon State University', country: 'United States' },
  { team: 'Husky Robotics', uni: 'University of Washington Seattle', country: 'United States' },
  { team: 'Mars Rover Design Team', uni: 'Missouri University of Science and Technology', country: 'United States' },
  { team: 'Michigan Mars Rover', uni: 'University of Michigan', country: 'United States' },
  { team: 'New Haven Robotics', uni: 'University of New Haven', country: 'United States' },
  { team: 'Northeastern University Mars Rover Team', uni: 'Northeastern University', country: 'United States' },
  { team: 'Team Mountaineers', uni: 'West Virginia University', country: 'United States' },
  { team: 'Team RoSE', uni: 'University of Hawaii at Manoa', country: 'United States' },
  { team: 'UMD Loop', uni: 'University of Maryland College Park', country: 'United States' },
  { team: 'Wisconsin Robotics', uni: 'University of Wisconsin-Madison', country: 'United States' },
  { team: 'Yonder Dynamics', uni: 'University of California San Diego', country: 'United States' },
]

/* ---------- The four missions ---------- */

export interface Mission {
  n: number
  id: string
  name: string
  lead: string
  steps: string[]
  result?: string
  /** Image to drop into public/img for this slide. */
  photo: string
  photoNote: string
  /** object-position for the frame, when the subject is off-centre. */
  photoPos?: string
}

export const MISSIONS: Mission[] = [
  {
    n: 1,
    id: 'servicing',
    name: 'Equipment Servicing Mission',
    lead: 'Precisely manipulate a switch, a knob, and a connector on a mock lander. Assisted by a human operator, but with no line of sight to the rover.',
    steps: ['Drive to a mock lander with no line of sight', 'Flip switches, turn knobs, plug in connectors,', 'Lift and carry a cache of tools'],
    photo: 'mission-servicing.jpg',
    photoNote: 'Taurus at the lander, arm on a switch',
  },
  {
    n: 2,
    id: 'autonomous',
    name: 'Autonomous Mission',
    lead: 'Drive itself to a point on a map, with nobody touching the controls.',
    steps: ['Reach GNSS waypoints across open desert', 'Find markers and objects by sight alone', 'Navigate around rocks and obstacles without human intervention'],
    photo: 'mission-autonomous.jpg',
    photoNote: 'Taurus driving itself, operators out of sight',
  },
  {
    n: 3,
    id: 'science',
    name: 'Science Mission',
    lead: 'Take the soil apart on the spot and look for signs of life.',
    steps: ['Collect subsurface samples in the field', 'Run onboard experiments for biosignatures', 'Defend the findings to a panel of scientists'],
    photo: 'mission-science.jpg',
    photoPos: '50% 62%',
    photoNote: 'The science cache or the onboard assay',
  },
  {
    n: 4,
    id: 'delivery',
    name: 'Delivery Mission',
    lead: 'Long-distance teleoperation: carry a payload across the desert to astronauts.',
    steps: ['Search the terrain for tools and cache', 'Pick up and carry over 5 kg', 'Deliver to astronauts across the field'],
    photo: 'mission-delivery.jpg',
    photoPos: '88% 50%',
    photoNote: 'Taurus carrying cargo across the desert',
  },
]

/* ---------- Eight seasons ---------- */

export interface Season {
  year: number
  rank: number | null
  kind: 'final' | 'sar' | 'cancelled'
  label: string
  note?: string
}

export const SEASONS: Season[] = [
  { year: 2018, rank: 13, kind: 'final', label: '13th' },
  { year: 2019, rank: 11, kind: 'final', label: '11th' },
  { year: 2020, rank: 3, kind: 'sar', label: '3rd', note: 'design review only · finals cancelled' },
  { year: 2021, rank: null, kind: 'cancelled', label: '—', note: 'finals cancelled' },
  { year: 2022, rank: 16, kind: 'final', label: '16th' },
  { year: 2023, rank: 16, kind: 'final', label: '16th' },
  { year: 2024, rank: 21, kind: 'final', label: '21st' },
  { year: 2025, rank: 8, kind: 'final', label: '8th' },
  { year: 2026, rank: 7, kind: 'final', label: '7th', note: 'best result' },
]

export const RESULT_2026 = {
  rank: 7,
  of: URC.teams,
  science: 95,
  equipmentServicingOrdinal: 3,
  deliveryOrdinal: 4,
  podium: [
    { place: 1, team: 'Missouri S&T', country: 'USA' },
    { place: 2, team: 'Monash Nova Rover', country: 'Australia' },
    { place: 3, team: 'UIU Mars Rover', country: 'Bangladesh' },
  ],
  bangladeshFinalists: ['AAUB Rover71', 'BRACU Mongol-Tori', 'MIST Mongol Barota', 'Project Altair (IUT)', 'UIU Mars Rover'],
}

/* ---------- Outreach ---------- */

export const OUTREACH = {
  institutions: 20,
  years: 2,
  mentors: ['FIRST Global Challenge', 'World Robot Olympiad'],
  note: 'Bangladeshi teams mentored to the world finals',
}

/* ---------- Partners ----------
   Industry–academia collaboration. Names are kept for the record and for alt
   text — the slide shows logos, not names, and says "global", not where anyone
   is from. Logos live in public/img/partners/, cropped to the artwork. */
export interface Partner {
  /** For the record and for alt text; never drawn on the slide. */
  name: string
  /** File in public/img/partners/. */
  slot: string
  /** What the collaboration produced — an outcome, not a company. */
  what: string
}

export const PARTNERS: Partner[] = [
  { name: 'SATEL', slot: 'satel.svg', what: 'Long range 433MHz Radio operation' },
  { name: 'CompleTech', slot: 'completech.svg', what: 'Antenna design and build based on strategic terrain of Bangladesh' },
  { name: 'SBG Systems', slot: 'sbg.svg', what: 'Tactical-grade inertial navigation on the rover' },
  { name: 'myActuator', slot: 'myactuator.svg', what: 'Precision actuators for the manipulator arm' },
  { name: 'K-Silver', slot: 'k-silver.svg', what: 'Precision actuation for the drive and the arm' },
]

export const PREVIOUS_PARTNER = {
  name: 'Meghna Group of Industries',
  slot: 'mgi.svg',
  line: 'The largest conglomerate in Bangladesh put its trust in us.',
  when: 'Title sponsor · 2025',
}

/** Everyone else behind the team — tools, hardware, travel. Logos only. */
export const SPONSORS: { name: string; slot: string }[] = [
  { name: 'Cytron Technologies', slot: 'cytron.svg' },
  { name: 'MSI', slot: 'msi.svg' },
  { name: 'Turkish Airlines', slot: 'turkish-airlines.svg' },
  { name: 'Logitech', slot: 'logitech.svg' },
  { name: 'Prolink', slot: 'prolink.svg' },
  { name: 'ODrive', slot: 'odrive.svg' },
  { name: 'Altium', slot: 'altium.svg' },
  { name: 'Ansys', slot: 'ansys.svg' },
  { name: 'MathWorks', slot: 'mathworks.svg' },
  { name: 'SolidWorks', slot: 'solidworks.svg' },
  { name: 'Aqualink', slot: 'aqualink.svg' },
  { name: 'Nyntax', slot: 'nyntax.svg' },
]

/** Why the team does this at all — not for the rulebook. Two reasons, one card
    each; the slide heading already says "beyond the competition". */
export const COLLABORATION = [
  { k: 'Encorages students from Bangladesh', v: 'Students learn by building real systems alongside engineers, not just in classrooms.' },
  { k: 'Bridging gaps in industry-academia', v: 'Turning academic project into real-world solutions.' },
]

/* ---------- What went wrong ---------- */

export interface Struggle {
  year: number
  what: string
  fix: string
  lesson: string
  photo: string
  photoNote: string
}

export const STRUGGLES: Struggle[] = [
  {
    year: 2024,
    what: 'The chassis broke two days before the competition.',
    fix: 'Rebuilt in the United States with whatever the team had carried with them.',
    lesson: 'Finished 21st, and went home knowing exactly what to build next.',
    photo: 'chassis-broke.jpg',
    photoNote: 'The broken chassis, two days before URC 2024',
  },
  {
    year: 2025,
    what: 'Every camera went down in 51 °C of Utah heat.',
    fix: 'The team finished the delivery mission on the one camera still alive — the one mounted under the rover.',
    lesson: 'Eighth in the world, on the mission where the vision failed.',
    photo: 'no-vision.jpg',
    photoNote: 'Driving on the one camera left, under the rover — URC 2025',
  },
  {
    year: 2026,
    what: 'The communication link went down mid-mission.',
    fix: 'Navigated on the onboard minimap alone and finished the run.',
    lesson: 'Seventh in the world, on the mission where the radio failed.',
    photo: 'mission-autonomous.jpg',
    photoNote: 'The navigation map on the control-station laptop, URC 2026',
  },
]

/* ---------- Who entered ----------
   Every one of the 116 teams on the official URC2026 registration list, in the
   country order the Mars Society publishes them:
   https://urc.marssociety.org/home/about-urc/history/urc2026/urc2026-team-info
   The 38 that reached the desert are marked. Stanford did not enter. */
export interface Entrant {
  country: string
  team: string
  uni: string
  finalist?: boolean
  /** Kept on the board although it did not reach the finals — a name people know. */
  featured?: boolean
}

export const ENTRANTS: Entrant[] = [
  { country: 'Australia', team: 'Monash Nova Rover', uni: 'Monash University', finalist: true },
  { country: 'Bangladesh', team: 'AAUB Rover71', uni: 'Aviation and Aerospace University Bangladesh', finalist: true },
  { country: 'Bangladesh', team: 'BRACU Mongol-Tori', uni: 'BRAC University', finalist: true },
  { country: 'Bangladesh', team: 'MIST Mongol Barota', uni: 'Military Institute of Science and Technology', finalist: true },
  { country: 'Bangladesh', team: 'Project Altair', uni: 'Islamic University of Technology', finalist: true },
  { country: 'Bangladesh', team: 'UIU Mars Rover', uni: 'United International University', finalist: true },
  { country: 'Bangladesh', team: 'Green University Mars Rover Team', uni: 'Green University of Bangladesh' },
  { country: 'Bangladesh', team: 'Red Frontier', uni: 'AIUB & Ahsanullah University' },
  { country: 'Bangladesh', team: 'Team Ogrodoot', uni: 'RUET' },
  { country: 'Bangladesh', team: 'Team Zenith', uni: 'RUET' },
  { country: 'Canada', team: 'Carleton Planetary Robotics Team', uni: 'Carleton University', finalist: true },
  { country: 'Canada', team: 'Queen\'s Space Engineering Team', uni: 'Queen\'s University', finalist: true },
  { country: 'Canada', team: 'Robotics for Space Exploration', uni: 'University of Toronto', finalist: true },
  { country: 'Canada', team: 'Space Concordia', uni: 'Concordia University', finalist: true },
  { country: 'Canada', team: 'McGill Robotics', uni: 'McGill University' },
  { country: 'Canada', team: 'SPEAR', uni: 'University of Alberta' },
  { country: 'Canada', team: 'Toronto MetRobotics', uni: 'Toronto Metropolitan University' },
  { country: 'Canada', team: 'UBC Rover', uni: 'University of British Columbia' },
  { country: 'Canada', team: 'UW Robotics', uni: 'University of Waterloo' },
  { country: 'Colombia', team: 'CERES Rover Team', uni: 'Universidad de los Andes' },
  { country: 'Colombia', team: 'MiliMars', uni: 'Universidad Militar Nueva Granada' },
  { country: 'Czechia', team: 'Brno Mars Rover', uni: 'Brno University of Technology' },
  { country: 'India', team: 'Team RUDRA', uni: 'SRM Institute of Science and Technology', finalist: true },
  { country: 'India', team: 'IITB Mars Rover Team', uni: 'IIT Bombay' },
  { country: 'India', team: 'Team Anveshak', uni: 'IIT Madras' },
  { country: 'India', team: 'Team Astra Robotics', uni: 'RV College of Engineering' },
  { country: 'India', team: 'Team Deimos', uni: 'IIT Mandi' },
  { country: 'India', team: 'Team Inferno DTU', uni: 'Delhi Technological University' },
  { country: 'India', team: 'Team Kalki', uni: 'Plaksha University' },
  { country: 'India', team: 'Team Proboticists', uni: 'IIT Kharagpur' },
  { country: 'India', team: 'Team RoverX', uni: 'VIT Vellore' },
  { country: 'India', team: 'VICHARAKA', uni: 'IISc Bangalore' },
  { country: 'Argentina / Bolivia', team: 'RoboSapiens', uni: 'UMSA, UNC and UTN' },
  { country: 'International', team: 'KARURA', uni: '17 Japanese and 2 U.S. institutions', finalist: true },
  { country: 'Italy', team: 'Team DIANA', uni: 'Politecnico di Torino', finalist: true },
  { country: 'Japan', team: 'ARES Project', uni: 'Six universities', finalist: true },
  { country: 'Japan', team: 'NAFT Mars Rover', uni: 'Four universities', finalist: true },
  { country: 'Japan', team: 'KIT-AURORA', uni: 'Kyushu Institute of Technology' },
  { country: 'México', team: 'Mars Rover UdeG Space', uni: 'Universidad de Guadalajara', finalist: true },
  { country: 'México', team: 'Quantum Robotics', uni: 'Multiple institutions', finalist: true },
  { country: 'Perú', team: 'CHASKA PUCP', uni: 'Pontifical Catholic University of Peru' },
  { country: 'Poland', team: 'IMPULS', uni: 'Kielce University of Technology', finalist: true },
  { country: 'Poland', team: 'KNR Rover Team', uni: 'Warsaw University of Technology', finalist: true },
  { country: 'Poland', team: 'Legendary Rover', uni: 'Rzeszow University of Technology', finalist: true },
  { country: 'Poland', team: 'PCz Rover Team', uni: 'Czestochowa University of Technology' },
  { country: 'Poland', team: 'UW Crows', uni: 'University of Warsaw' },
  { country: 'Puerto Rico', team: 'Project AV', uni: 'University of Puerto Rico at Mayaguez' },
  { country: 'Republic of Korea', team: 'MR2', uni: 'KAIST', finalist: true },
  { country: 'Republic of Korea', team: 'Zenith Space', uni: 'Seoul National University of Science and Technology', finalist: true },
  { country: 'Singapore', team: 'NUS Mars Rover Team', uni: 'National University of Singapore' },
  { country: 'Türkiye', team: 'Yildiz Rover', uni: 'Yildiz Technical University', finalist: true },
  { country: 'Türkiye', team: 'ITU Rover Team', uni: 'Istanbul Technical University' },
  { country: 'Türkiye', team: 'METU Rover', uni: 'Middle East Technical University' },
  { country: 'Türkiye', team: 'OzU Rover', uni: 'Ozyegin University' },
  { country: 'Türkiye', team: 'SEBURA Rover Team', uni: 'Istanbul Okan University' },
  { country: 'Türkiye', team: 'SuRover', uni: 'Sabanci University' },
  { country: 'United States', team: 'A.S.T.R.A.', uni: 'University of Alabama in Huntsville', finalist: true },
  { country: 'United States', team: 'Binghamton University Rover Team', uni: 'Binghamton University', finalist: true },
  { country: 'United States', team: 'BYU Mars Rover', uni: 'Brigham Young University', finalist: true },
  { country: 'United States', team: 'Cornell Mars Rover', uni: 'Cornell University', finalist: true },
  { country: 'United States', team: 'DAM Robotics', uni: 'Oregon State University', finalist: true },
  { country: 'United States', team: 'Husky Robotics', uni: 'University of Washington', finalist: true },
  { country: 'United States', team: 'Mars Rover Design Team', uni: 'Missouri S&T', finalist: true },
  { country: 'United States', team: 'Michigan Mars Rover', uni: 'University of Michigan', finalist: true },
  { country: 'United States', team: 'New Haven Robotics', uni: 'University of New Haven', finalist: true },
  { country: 'United States', team: 'Northeastern University Mars Rover Team', uni: 'Northeastern University', finalist: true },
  { country: 'United States', team: 'Team Mountaineers', uni: 'West Virginia University', finalist: true },
  { country: 'United States', team: 'Team RoSE', uni: 'University of Hawaii at Manoa', finalist: true },
  { country: 'United States', team: 'UMD Loop', uni: 'University of Maryland', finalist: true },
  { country: 'United States', team: 'Wisconsin Robotics', uni: 'University of Wisconsin', finalist: true },
  { country: 'United States', team: 'Yonder Dynamics', uni: 'UC San Diego', finalist: true },
  { country: 'United States', team: 'Astrobotics @ Virginia Tech', uni: 'Virginia Tech' },
  { country: 'United States', team: 'Atl Rover', uni: 'Georgia State University' },
  { country: 'United States', team: 'BEAR', uni: 'UC Berkeley', featured: true },
  { country: 'United States', team: 'BILL-EE', uni: 'Cal Poly Pomona' },
  { country: 'United States', team: 'Black Bear Robotics', uni: 'University of Maine' },
  { country: 'United States', team: 'Boston University Mars Rover Club', uni: 'Boston University' },
  { country: 'United States', team: 'Cosmic Coogs', uni: 'University of Houston' },
  { country: 'United States', team: 'Cowboy Robotics Club', uni: 'University of Wyoming' },
  { country: 'United States', team: 'CU Rover Team', uni: 'University of Colorado Boulder' },
  { country: 'United States', team: 'Domer Rover', uni: 'University of Notre Dame' },
  { country: 'United States', team: 'Exploration Robotics at Illinois', uni: 'University of Illinois' },
  { country: 'United States', team: 'G3R', uni: 'University of North Texas' },
  { country: 'United States', team: 'GU Robotics', uni: 'Gonzaga University' },
  { country: 'United States', team: 'Harvard Undergraduate Robotics Club', uni: 'Harvard University', featured: true },
  { country: 'United States', team: 'Lehigh University Rover Challenge', uni: 'Lehigh University' },
  { country: 'United States', team: 'Mars Rover at Penn', uni: 'UPenn' },
  { country: 'United States', team: 'Maverick Rover Team', uni: 'UT Arlington' },
  { country: 'United States', team: 'MAVRIC', uni: 'Iowa State University' },
  { country: 'United States', team: 'MIRAGE', uni: 'Texas A&M University' },
  { country: 'United States', team: 'NIU Mars Rover', uni: 'Northern Illinois University' },
  { country: 'United States', team: 'O.R.E.D.G.R.', uni: 'Colorado School of Mines' },
  { country: 'United States', team: 'OC Robotics', uni: 'Orange Coast College' },
  { country: 'United States', team: 'Panther Robotics', uni: 'University of Pittsburgh' },
  { country: 'United States', team: 'Project S.T.O.R.M.', uni: 'University of Central Florida' },
  { country: 'United States', team: 'Rice Robotics R-OWL-vers', uni: 'Rice University' },
  { country: 'United States', team: 'RIT SPEX Rovers', uni: 'Rochester Institute of Technology' },
  { country: 'United States', team: 'Roadrunners', uni: 'UT San Antonio' },
  { country: 'United States', team: 'RoboJackets', uni: 'Georgia Tech' },
  { country: 'United States', team: 'Rose-Hulman Rover', uni: 'Rose-Hulman Institute of Technology' },
  { country: 'United States', team: 'SC Robotics', uni: 'Saddleback College' },
  { country: 'United States', team: 'SJSU Robotics', uni: 'San Jose State University' },
  { country: 'United States', team: 'Slugbotics', uni: 'UC Santa Cruz' },
  { country: 'United States', team: 'Solis Rover Project', uni: 'UT Dallas' },
  { country: 'United States', team: 'Sooner Rover', uni: 'University of Oklahoma' },
  { country: 'United States', team: 'Space Bulls', uni: 'University at Buffalo' },
  { country: 'United States', team: 'Sun Devil Robotics', uni: 'Arizona State University' },
  { country: 'United States', team: 'Terrestrial Robotics at Ohio State', uni: 'Ohio State University' },
  { country: 'United States', team: 'Titan Rover', uni: 'Cal State Fullerton' },
  { country: 'United States', team: 'Trickfire Robotics', uni: 'UW Bothell' },
  { country: 'United States', team: 'UC Irvine Legacy Robotics', uni: 'UC Irvine' },
  { country: 'United States', team: 'University of Dayton Mars Rover Team', uni: 'University of Dayton' },
  { country: 'United States', team: 'urc@ucla', uni: 'UCLA' },
  { country: 'United States', team: 'USC Field Robotics Lab', uni: 'University of Southern California' },
  { country: 'United States', team: 'USU Mars Rover Team', uni: 'Utah State University' },
  { country: 'United States', team: 'Yale Exploration Rover', uni: 'Yale University', featured: true },
]

/** Each country's top teams: its finalists, plus any entrant marked `featured`,
    or — where none got through — the teams it sent. The board on slide 5 walks
    through these, country by country. */
export const TOP_BY_COUNTRY: Entrant[] = (() => {
  const byCountry = new Map<string, Entrant[]>()
  for (const e of ENTRANTS) byCountry.set(e.country, [...(byCountry.get(e.country) ?? []), e])
  return [...byCountry.values()].flatMap((list) => (list.some((e) => e.finalist) ? list.filter((e) => e.finalist || e.featured) : list))
})()

/* ---------- The season ----------
   Only the two dates are published; the earlier stops are described by what has
   to be handed in. Source: the Mars Society's finalist announcement, 18 March 2026. */
export interface Milestone {
  label: string
  when: string
  detail: string
  hard?: boolean
}

export const TIMELINE: Milestone[] = [
  { label: 'Registration', when: 'Season opens', detail: '116 teams · 18 countries' },
  { label: 'Preliminary Design Review', when: 'Written review', detail: 'Every team, on paper' },
  { label: 'System Acceptance Review', when: 'Report + video', detail: 'Scored by judges', hard: true },
  { label: 'Finalists named', when: '18 March 2026', detail: '38 teams · 11 countries' },
  { label: 'Finals at MDRS', when: '27–30 May 2026', detail: 'Hanksville, Utah', hard: true },
]

