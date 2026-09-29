/**
 * Single source of truth for every piece of content in the portfolio.
 * Everything here is transcribed from Ognjen_Badivuk_CV.pdf.
 *
 * The `projects` array is the one synthesised section: the CV has no dedicated
 * "Projects" block, so each entry is built from a concrete achievement bullet
 * in the Experience section. Edit freely.
 */

export const profile = {
  name: 'Ognjen Badivuk',
  firstName: 'Ognjen',
  lastName: 'Badivuk',
  title: 'Backend / Application Engineer',
  disciplines: ['PHP', 'Python', 'Data Pipelines', 'Laravel'],
  tagline:
    'I build high-reliability scraping systems, REST API integrations and ETL pipelines that move tens of thousands of records a day — without blinking.',
  location: 'Niš, Serbia',
  email: 'ognjen.badivuk@gmail.com',
  phone: '+381 60 7697787',
  linkedin: 'https://linkedin.com/in/ognjen-badivuk',
  linkedinLabel: 'linkedin.com/in/ognjen-badivuk',
  /**
   * Hero imagery. Both files are generated from the originals in `src/img/`
   * by `scripts/build-images.py` — see the README before swapping them out.
   *   portrait  → the circular profile disc (transparent cutout, 1000×1000)
   *   backdrop  → the low-opacity parallax layer behind the hero
   */
  portrait: '/ognjen-portrait.webp',
  portraitSmall: '/ognjen-portrait-sm.webp',
  backdrop: '/ognjen-backdrop.webp',
  backdropSmall: '/ognjen-backdrop-sm.webp',
  resumeFile: '/Ognjen_Badivuk_CV.pdf',
  available: true,
  /**
   * Formspree endpoint the contact form POSTs to. Public by design — it's a
   * write-only submission URL, not a secret, and it has to ship in the client
   * bundle to work. Manage submissions and spam filtering at formspree.io.
   */
  formEndpoint: 'https://formspree.io/f/mrpbravl',
}

export const summary = `Backend and Application Engineer with 3+ years of professional experience building and maintaining high-reliability data scraping systems, RESTful API integrations, and ETL pipelines at scale. Proficient in PHP (Laravel) and Python, with a strong track record of improving data quality, reducing pipeline failures, and owning complex features end-to-end at Better Collective — a global leader in sports betting media. Currently advancing the scraping architecture with a focus on robustness, observability, and maintainability. M.Sc. candidate in Software and Data Engineering.`

export const stats = [
  { value: 17000, suffix: '+', label: 'Scraping jobs run daily' },
  { value: 40000, suffix: '+', label: 'Records persisted per cycle' },
  { value: 200, suffix: '+', label: 'Scrapers maintained' },
  { value: 3, suffix: 'h', label: 'Full-run completion window', prefix: '<' },
]

export const experience = [
  {
    company: 'Better Collective',
    role: 'Full Stack Engineer',
    period: 'Jan 2026 — Present',
    start: '2026',
    current: true,
    blurb:
      'Architecting the next generation of a large-scale PHP/Python scraping platform for a global leader in sports betting media.',
    stack: ['PHP', 'Python', 'Laravel', 'MySQL', 'AWS', 'CodeShip'],
    points: [
      'Architect and lead improvements to a large-scale PHP/Python scraping framework, enhancing system robustness, error handling, and long-term maintainability.',
      'Design and implement data monitoring and validation mechanisms that enforce data quality and consistency across multiple affiliate tracking integrations.',
      'Drive end-to-end ownership of complex features — from technical design and implementation through deployment and post-release maintenance.',
      'Optimise existing data pipeline components for performance, scalability, and fault tolerance — the system executes 17,000+ automated scraping jobs daily, completing the full run in under 3 hours and persisting 40,000+ records per cycle.',
      'Collaborate cross-functionally with data, product, and platform teams to deliver reliable, production-grade data pipelines.',
    ],
  },
  {
    company: 'Better Collective',
    role: 'Junior Full Stack Engineer',
    period: 'Oct 2022 — Dec 2025',
    start: '2022',
    current: false,
    blurb:
      'Built and hardened 200+ scrapers inside a modular, tree-based framework, and owned the API integrations feeding the data platform.',
    stack: ['PHP', 'Python', 'Laravel', 'pytest', 'Puppeteer', 'REST'],
    points: [
      'Maintained and developed 200+ PHP and Python scraping scripts within a modular, tree-based framework (decorator pattern, Recipe classes), ensuring 100% successful data capture across all integrated affiliate sources.',
      'Engineered RESTful API integrations with affiliate/partner tracking platforms, implementing payout parsing, commission calculation, and conversion tracking logic.',
      'Improved data extraction reliability by debugging and extending core decorator classes (ConvertXmlToJson, ConvertCsvToJson), resolving edge-case failures and expanding unit test coverage.',
      'Authored Laravel database migrations following strict codebase conventions, extending the schema with nullable decimal commission columns for new metrics tracking.',
      'Implemented regex-based affiliate identifier parsing (pipe-delimited preg_match patterns) to support multi-parameter affiliate tracking across networks.',
      'Wrote and refactored unit tests using pytest and unittest.mock, ensuring correctness and long-term maintainability of decorator classes.',
      'Supported CI/CD pipeline stability via CodeShip and AWS, contributing to reliable deployment workflows.',
    ],
  },
  {
    company: 'NextBlink doo',
    role: 'Junior Programmer — Internship',
    period: 'May 2022 — Sep 2022',
    start: '2022',
    current: false,
    blurb: 'First professional team environment — shipping working software alongside senior engineers.',
    stack: ['OOP', 'Teamwork', 'Agile'],
    points: [
      'Contributed to software development projects in a professional team environment, applying OOP principles and collaborating with senior engineers to deliver working software solutions.',
    ],
  },
]

/**
 * Synthesised from the achievement bullets in the CV's Experience section.
 */
export const projects = [
  {
    index: '01',
    name: 'Distributed Scraping Framework',
    role: 'Architect & Lead',
    context: 'Better Collective',
    description:
      'A large-scale PHP/Python scraping platform built on a modular, tree-based architecture with Recipe classes and decorator composition. Re-architected for robustness, error handling and long-term maintainability.',
    metrics: [
      { k: '17,000+', v: 'jobs / day' },
      { k: '< 3h', v: 'full run' },
      { k: '40,000+', v: 'records / cycle' },
    ],
    tags: ['PHP', 'Python', 'Puppeteer', 'MySQL', 'AWS'],
    featured: true,
  },
  {
    index: '02',
    name: 'Data Quality & Validation Layer',
    role: 'Design & Implementation',
    context: 'Better Collective',
    description:
      'Monitoring and validation mechanisms that enforce data quality and consistency across multiple affiliate tracking integrations — catching malformed payloads before they ever reach the warehouse.',
    metrics: [
      { k: '100%', v: 'capture rate' },
      { k: 'Multi-source', v: 'validation' },
    ],
    tags: ['Python', 'ETL', 'Observability', 'Data Normalization'],
    featured: true,
  },
  {
    index: '03',
    name: 'Affiliate REST Integration Suite',
    role: 'Backend Engineer',
    context: 'Better Collective',
    description:
      'RESTful integrations with affiliate and partner tracking platforms, covering payout parsing, commission calculation and conversion tracking logic across a wide spread of network APIs.',
    metrics: [
      { k: 'REST', v: 'partner APIs' },
      { k: 'Payouts', v: '+ conversions' },
    ],
    tags: ['PHP', 'REST APIs', 'Laravel', 'MySQL'],
    featured: false,
  },
  {
    index: '04',
    name: 'Decorator Transformation Core',
    role: 'Maintainer',
    context: 'Better Collective',
    description:
      'Debugged and extended the core decorator classes (ConvertXmlToJson, ConvertCsvToJson) that normalise every inbound feed — resolving edge-case failures and widening unit test coverage around them.',
    metrics: [
      { k: 'XML / CSV', v: '→ JSON' },
      { k: 'Edge cases', v: 'resolved' },
    ],
    tags: ['Python', 'pytest', 'unittest.mock', 'Decorator Pattern'],
    featured: false,
  },
  {
    index: '05',
    name: 'Commission Metrics Schema',
    role: 'Database Engineer',
    context: 'Better Collective',
    description:
      'Laravel migrations authored to strict codebase conventions, extending the schema with nullable decimal commission columns to unlock a new generation of metrics tracking.',
    metrics: [
      { k: 'Laravel', v: 'migrations' },
      { k: 'Schema', v: 'design' },
    ],
    tags: ['Laravel', 'MySQL', 'Migrations', 'Schema Design'],
    featured: false,
  },
  {
    index: '06',
    name: 'Multi-Parameter ID Parser',
    role: 'Backend Engineer',
    context: 'Better Collective',
    description:
      'Regex-based affiliate identifier parsing using pipe-delimited preg_match patterns, enabling multi-parameter affiliate tracking to work consistently across heterogeneous networks.',
    metrics: [
      { k: 'Regex', v: 'preg_match' },
      { k: 'Multi-param', v: 'tracking' },
    ],
    tags: ['PHP', 'Regex', 'Data Normalization'],
    featured: false,
  },
]

export const skills = [
  {
    category: 'Languages',
    icon: 'code',
    items: ['PHP', 'Python', 'SQL (MySQL)'],
  },
  {
    category: 'Frameworks',
    icon: 'layers',
    items: ['Laravel', 'PHPUnit', 'pytest', 'unittest.mock'],
  },
  {
    category: 'Tools',
    icon: 'tool',
    items: ['Git', 'REST APIs', 'AWS', 'CodeShip (CI/CD)', 'Puppeteer'],
  },
  {
    category: 'Concepts',
    icon: 'spark',
    items: [
      'Web Scraping',
      'ETL / Data Pipelines',
      'OOP',
      'Decorator Pattern',
      'Data Normalization',
      'Unit Testing',
      'TDD',
      'Agile / Scrum',
    ],
  },
  {
    category: 'Databases',
    icon: 'database',
    items: ['MySQL', 'Query Optimisation', 'Schema Design', 'Migrations'],
  },
]

/** Flat list used by the infinite marquee strip. */
export const marqueeSkills = [
  'PHP',
  'Python',
  'Laravel',
  'MySQL',
  'REST APIs',
  'ETL',
  'Web Scraping',
  'Puppeteer',
  'pytest',
  'PHPUnit',
  'AWS',
  'CodeShip',
  'Git',
  'TDD',
  'Agile',
  'Data Pipelines',
]

export const education = [
  {
    degree: 'Master of Software and Data Engineering',
    school: 'Singidunum University',
    period: '2023 — Present',
    status: 'In Progress',
  },
  {
    degree: 'Bachelor of Software and Data Engineering',
    school: 'Singidunum University',
    period: '2019 — 2023',
    status: 'Completed',
  },
]

export const certifications = [
  { issuer: 'IBM Academic Initiative', name: 'Essentials of Rational Software Architect' },
  { issuer: 'Oracle Academy', name: 'Database Design and Programming with SQL' },
  { issuer: 'Udemy', name: 'Learn PHP Programming From Scratch' },
]

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]
