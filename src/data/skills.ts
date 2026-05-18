export type SkillCategory = "frontend" | "backend" | "databases" | "tools";

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

  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "Postman", category: "tools" },
  { name: "Swagger", category: "tools" },
  { name: "CI/CD", category: "tools" },
];
