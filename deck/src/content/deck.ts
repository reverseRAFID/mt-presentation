/* The spine of the talk. Numbers come from facts.ts and nowhere else.
   The rover is the deck's progress bar: it parks at station `i` of the mission
   map (src/rover/terrain.ts), so a slide only says how it arrives and what it
   does while it waits. */

export type IdleKind = 'showcase' | 'bob' | 'turntable' | 'wave' | 'still'
export type EnterKind = 'drive' | 'hop' | 'spin' | 'climb' | 'zoom' | 'wobble'

export interface RoverPose {
  /** What it does while it is parked. */
  idle: IdleKind
  /** The flourish it makes on arriving. */
  enter: EnterKind
}

export interface SlideMeta {
  id: string
  section: string
  title: string
  endsAt: number
  words: number
  spoken: string
  notes: string
  rover: RoverPose
}

/** Replace with the real join / apply page before the event. Shown under the QR on the last slide. */
export const JOIN_URL = 'https://www.facebook.com/bracumongoltori'

export const SLIDES: SlideMeta[] = [
  {
    id: 'cover',
    section: 'Cover',
    title: 'Built by dreamers and problem solvers',
    endsAt: 15,
    words: 32,
    spoken:
      'Every May, a stretch of desert in Utah becomes Mars. This year one of the rovers there was built in Dhaka, by undergraduates, in a lab at BRAC University.',
    notes: 'Open on the machine, not the team name. Let the photograph sit for a beat before you say anything.',
    rover: { idle: 'showcase', enter: 'zoom' },
  },
  {
    id: 'about',
    section: 'Who we are',
    title: 'Dreamers and problem solvers',
    endsAt: 55,
    words: 95,
    spoken:
      'We are BRACU Mongol-Tori. Mongol Tori means Mars vessel. Thirty-five undergraduates from five departments of BRAC University — computer science, electrical engineering, business, mathematics and natural science. Six technical sub-teams under an advisor, a team lead and a co-lead: mechanical, electronics, controls and software, autonomous, network and vision, and astrobiology. Between them they design, build and integrate every core subsystem of the rover. And two more that never touch it — PR and outreach, who take robotics into schools, and management, who keep the whole thing paid for. Nobody arrives knowing how to build a Mars rover. You arrive wanting to.',
    notes:
      'Walk the chart with your hand, left to right. Name the six quickly — the list length is the point, not the detail. Then slow down on the last two: a rover team is not only engineers, and there is a job here for a business or a maths student too.',
    rover: { idle: 'wave', enter: 'hop' },
  },
  {
    id: 'rover',
    section: 'The machine',
    title: 'Taurus',
    endsAt: 100,
    words: 105,
    spoken:
      'This is Taurus, this year’s rover, and its job is to assist an astronaut. Watch what that means. It drives itself over the rocks to where it is needed. It has a seven-axis arm that lifts over five kilos and puts a tool into somebody’s hand. It takes soil where it stands and runs the assay on board. And the whole time it is being driven from a command station three kilometres away, with a ridge in between — nobody can see it. One more thing: a commercial six-axis arm costs over five lakh taka. Ours is built from recycled brushed DC motors for under twenty thousand.',
    notes: 'Let the sequence play and narrate it — do not read the tiles. Four acts, about four seconds each, so you get one full loop. The arm cost at the end is the line students repeat.',
    rover: { idle: 'showcase', enter: 'spin' },
  },
  {
    id: 'benchmark',
    section: 'Benchmark',
    title: 'How do you know it is any good?',
    endsAt: 125,
    words: 58,
    spoken:
      'So we had built a rover. The problem with building something nobody around you has built is that you have no idea whether it is any good. You need a benchmark. There are three that matter: the International Rover Challenge in India, the European Rover Challenge in Poland, and the University Rover Challenge in Utah. We chose Utah.',
    notes: 'Short slide. The question — how do you know it is any good — is the hinge of the whole talk.',
    rover: { idle: 'bob', enter: 'drive' },
  },
  {
    id: 'why-urc',
    section: 'Why URC',
    title: 'Not because it is easy',
    endsAt: 170,
    words: 105,
    spoken:
      'Why that one? Kennedy said it at Rice in nineteen sixty-two: we choose to go to the Moon not because it is easy, but because it is hard. We chose the University Rover Challenge as our benchmark for exactly that reason. It is the hardest one. This year a hundred and sixteen teams from eighteen countries entered, and after months of design reviews and video reviews, thirty-eight made the finals. Look at who is on that list. Missouri, Michigan, Cornell, Toronto, KAIST, Politecnico di Torino. That is the room we wanted to be measured in.',
    notes: 'Read the Kennedy line, do not paraphrase it. Then let the team list flip on its own while you name three or four out loud.',
    rover: { idle: 'bob', enter: 'climb' },
  },
  {
    id: 'm-servicing',
    section: 'Mission 01',
    title: 'Equipment Servicing',
    endsAt: 195,
    words: 58,
    spoken:
      'Over three days the rover has to run four completely different missions. The first is equipment servicing. Drive to a mock lander you cannot see, and then flip switches, turn knobs, plug in connectors and type on a keyboard — with a robot arm, from a kilometre away. This year we had the third-highest score of any team on it.',
    notes: 'Hold your hand up and mime the switch. The distance is the thing that lands.',
    rover: { idle: 'showcase', enter: 'drive' },
  },
  {
    id: 'm-autonomous',
    section: 'Mission 02',
    title: 'Autonomous Navigation',
    endsAt: 220,
    words: 55,
    spoken:
      'Second, autonomous navigation. Nobody touches the controls. The rover is given a point on a map, hundreds of metres away, and it has to get there on its own — across open desert, finding markers by sight. Four sensors that are each wrong in their own way, and a computer that decides which one to trust.',
    notes: 'The line about four imperfect answers is the one to land if you have a second to spare.',
    rover: { idle: 'turntable', enter: 'spin' },
  },
  {
    id: 'm-science',
    section: 'Mission 03',
    title: 'Science',
    endsAt: 245,
    words: 55,
    spoken:
      'Third, science. Dig soil in the field, run the assays on board, and then stand in front of a panel of actual scientists and defend what you think you found. This is the mission that decides whether a rover is a robot or an instrument. Ninety-five out of a hundred this year.',
    notes: 'Ninety-five out of a hundred is the strongest single number in the deck. Say it slowly.',
    rover: { idle: 'bob', enter: 'wobble' },
  },
  {
    id: 'm-delivery',
    section: 'Mission 04',
    title: 'Delivery',
    endsAt: 270,
    words: 50,
    spoken:
      'And fourth, delivery. Search the terrain, find a toolbox, pick it up, carry more than five kilos across rocks, and hand it to an astronaut on the other side. Fourth-highest score of any team.',
    notes: 'Keep this one brisk — it is the last of the four and the audience has the pattern by now.',
    rover: { idle: 'bob', enter: 'drive' },
  },
  {
    id: 'seasons',
    section: 'Eight seasons',
    title: 'Eight seasons since 2018',
    endsAt: 310,
    words: 90,
    spoken:
      'This is every season since 2018. Thirteenth. Eleventh. Third on the design review the year the finals were cancelled. Sixteenth. Sixteenth. Then twenty-first — the year everything broke. Then eighth. And this May, seventh in the world, out of a hundred and sixteen. Five Bangladeshi teams reached the finals and United International University finished third overall. The line that matters is the one after the failure. Nothing on this chart got better because a season went smoothly.',
    notes: 'Be precise about 2020 and 2021 out loud — the finals were cancelled both years. Trace the whole line with your hand.',
    rover: { idle: 'bob', enter: 'climb' },
  },
  {
    id: 'outreach',
    section: 'Outreach',
    title: 'Nobody gets there alone',
    endsAt: 350,
    words: 90,
    spoken:
      'None of this comes from working alone. Over the past two years we have taken the rover to more than twenty schools and colleges across Bangladesh to teach STEM, and we mentor school teams into the FIRST Global Challenge and the World Robot Olympiad. That is Team Lazy Go, in Singapore, carrying the flag at the World Robot Olympiad. Somebody let us touch a robot once. That is the only reason we are standing here.',
    notes: 'Slow right down. Point at the photographs and name what is happening. This is the slide the students remember.',
    rover: { idle: 'wave', enter: 'hop' },
  },
  {
    id: 'partners',
    section: 'Partners',
    title: 'Beyond the competition',
    endsAt: 380,
    words: 75,
    spoken:
      'And none of this stops at the competition. We work with industry — global partners who answered a student email. Together we verified a three-kilometre radio link in Bangladeshi conditions. We designed an antenna with one of them that they now sell as a product, built on our codebase. And last year the largest conglomerate in Bangladesh put its trust in us as title sponsor. That is the part we care about most: industry and academia solving real requirements together, not just a rulebook.',
    notes:
      'Do not name the companies out loud unless asked — the logos do that. The line to land is the antenna that became a product: a student team whose code is now inside something somebody sells.',
    rover: { idle: 'showcase', enter: 'drive' },
  },
  {
    id: 'struggle',
    section: 'Not on the spec sheet',
    title: 'The part that is not on the spec sheet',
    endsAt: 425,
    words: 100,
    spoken:
      'Now the part nobody puts on the poster. In 2024 the chassis broke two days before the competition, and the team rebuilt it in the United States with whatever they had carried with them. In 2025 the Utah heat hit fifty-one degrees and every camera on the rover went down — and the team finished the delivery mission on the one camera that was still alive, the one underneath. In 2026, mid-mission, the communication link went down — and they navigated on the onboard minimap alone and finished the run anyway. That is not a story about robots. Competition is a part of learning: it is what turns a group of students into people who can be handed a broken thing and a deadline.',
    notes: 'The emotional centre. Do not apologise for the failures and do not add a redemptive clause — the last line does that work.',
    rover: { idle: 'bob', enter: 'wobble' },
  },
  {
    id: 'close',
    section: 'Close',
    title: 'Come and break things with us',
    endsAt: 450,
    words: 55,
    spoken:
      'One last thing. Etched into the aluminium shell of our rover are jamdani motifs. If that machine ever reaches Mars, something Bangladeshi goes with it. You do not need a space agency to start. You need a team, a deadline, and somewhere to break things. Come find us. Thank you.',
    notes: 'Hold this slide up during Q&A. The QR is the only conversion mechanism in the talk — test that it scans from six metres.',
    rover: { idle: 'wave', enter: 'zoom' },
  },
]

export const TOTAL_SECONDS = 450

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}
