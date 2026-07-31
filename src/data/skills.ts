export type SkillCategory =
  | "frontend"
  | "backend"
  | "databases"
  | "cloud"
  | "security"
  | "tools";

export type Skill = {
  name: string;
  category: SkillCategory;
};

export const skills: Skill[] = [
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Vue.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "HTML", category: "frontend" },
  { name: "CSS", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Bootstrap", category: "frontend" },

  { name: "PHP", category: "backend" },
  { name: "Laravel", category: "backend" },
  { name: "Node.js", category: "backend" },
  { name: "Nest.js", category: "backend" },
  { name: "Express", category: "backend" },
  { name: "Python", category: "backend" },
  { name: "REST APIs", category: "backend" },

  { name: "MySQL", category: "databases" },
  { name: "PostgreSQL", category: "databases" },
  { name: "Oracle", category: "databases" },
  { name: "MongoDB", category: "databases" },

  { name: "AWS", category: "cloud" },
  { name: "Google Cloud", category: "cloud" },
  { name: "Netlify", category: "cloud" },
  { name: "Vercel", category: "cloud" },

  { name: "OWASP Top 10", category: "security" },
  { name: "OWASP API Security", category: "security" },
  { name: "Security Testing", category: "security" },
  { name: "JWT & Auth", category: "security" },

  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "Postman", category: "tools" },
  { name: "Swagger", category: "tools" },
  { name: "CI/CD", category: "tools" },
];
