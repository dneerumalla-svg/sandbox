/**
 * ============================================================
 *  PORTFOLIO CONTENT — single source of truth
 * ============================================================
 *  Edit every value in this file to update the portfolio.
 *  - Add a project → push a new object into `projects`.
 *  - Add a timeline entry → push into `timeline`.
 *  - Add a skill → push into the relevant array in `skills`.
 * ============================================================
 */

export const site = {
  name: "Dhruv Neerumalla",
  firstName: "Dhruv",
  lastName: "Neerumalla",
  initials: "DN",
  role: "Student Developer",
  tagline: "Student Developer",
  intro:
    "I am a high school sophomore exploring computer science, AI, and software development through hands-on projects. Currently learning Python and using AI-assisted coding tools to help me build, experiment, and understand how software is created.",
  location: "",
};

export const links = {
  github: "https://github.com/dneerumalla-svg",
  email: "dneerumalla@gmail.com",
};

export const about = {
  paragraphs: [
    "I’m a high school sophomore based in Delaware, USA, interested in computer science, AI, and building software. I started exploring programming because I wanted to move beyond just using technology and begin understanding how the tools around me can let me create everyday applications and websites on my own.",
    "Right now, I’m focused on learning Python fundamentals while experimenting with AI-assisted development and vibe coding. I use AI tools as a beginner to help me turn ideas into projects, learn from the code being created, and gradually build a stronger understanding of programming while creating projects that solve real problems.",
    "I enjoy learning through hands-on coding projects, exploring new tools, and finding ways to turn my ideas into something functional.",
  ],
};

export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export const timeline: TimelineEntry[] = [
  {
    year: "2026 — Present",
    title: "Exploring Programming & Building Projects",
    description:
      "Learning Python, experimenting with AI-assisted coding tools, and building beginner projects to develop programming skills and understand the process of creating software.",
  },
];

export type Project = {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    title: "Future Projects",
    description:
      "Projects I create as I continue learning programming, software development, and computer science.",
    technologies: [],
  },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Programming",
    items: ["Python"],
  },
  {
    category: "Tools",
    items: ["GitHub", "AI-assisted development tools", "Git"],
  },
  {
    category: "Concepts",
    items: ["Problem solving", "Programming fundamentals"],
  },
];

export const currentlyLearning = {
  topic: "Python & AI-Assisted Development",
  description:
    "Learning about looping statements in Python and about making better UI and more secure applications while vibe coding.",
  progress: 20,
};
