// /frontend/src/lib/criteria.js
export const ALL_CRITERIA = [
  { key: 'Technical Quality', label: 'Technical Quality', isMain: true, abbr: 'TQ' },
  { key: 'Posture & Balance', label: 'Posture & Balance', isMain: false, abbr: 'P&B' },
  { key: 'Movement to Music', label: 'Movement to Music', isMain: true, abbr: 'M2M' },
  { key: 'Start/Ending', label: 'Start/Ending', isMain: false, abbr: 'S/E' },
  { key: 'Partnering Skill', label: 'Partnering Skill', isMain: true, abbr: 'PS' },
  { key: 'Floorcraft', label: 'Floorcraft', isMain: false, abbr: 'FC' },
  { key: 'Stamina', label: 'Stamina', isMain: false, abbr: 'ST' },
  { key: 'Choreography and Presentation', label: 'Choreography & Presentation', isMain: true, abbr: 'C&P' },
  { key: 'Appearance', label: 'Appearance', isMain: false, abbr: 'AP' },
];

// Eine Helfer-Funktion, um nur die Keys zu bekommen
export const ALL_CRITERIA_KEYS = ALL_CRITERIA.map(c => c.key);